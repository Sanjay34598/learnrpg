/**
 * main.js
 * ─────────────────────────────────────────────────────────────────────────
 * Application bootstrap — runs after all other scripts have loaded.
 *
 * Responsibilities:
 *   1. Read URL params:
 *      ?course=<courseId>  — pre-select a course (from role.html → learn.html)
 *      ?role=<roleId>      — set the "Back to Path" link correctly
 *   2. Update the top-bar back link.
 *   3. Attempt auto-login from localStorage (returning player).
 *   4. If no saved player, show the login overlay and focus the name input.
 */

/* ── Read URL params ─────────────────────────────────────────── */
const _params    = new URLSearchParams(window.location.search);
const _urlCourse = _params.get("course") || null;   // e.g. "python"
const _urlRole   = _params.get("role")   || null;   // e.g. "data-analyst"

/* ── Patch the topbar back link ──────────────────────────────── */
(function patchBackLink() {
  const backBtn = document.getElementById("topbarBack");
  if (!backBtn) return;

  const isWorkspace = window.location.pathname.includes("mission.html");

  if (isWorkspace) {
    const courseId = _urlCourse || (state && state.courseId) || "python";
    const roleParam = _urlRole ? `&role=${_urlRole}` : "";
    backBtn.href        = `learn.html?course=${courseId}${roleParam}`;
    backBtn.textContent = "← Dashboard";
  } else {
    if (_urlRole) {
      backBtn.href        = `role.html?id=${_urlRole}`;
      backBtn.textContent = "← Back to Path";
    } else {
      backBtn.href        = "index.html";
      backBtn.textContent = "← All Paths";
    }
  }
})();

/**
 * Signs in a player by name.
 * Loads or creates their profile, restores their last course and mission,
 * hides the login overlay, and triggers the first full render.
 * @param {string} name — raw player name from the input
 */
function signIn(name) {
  const clean = name.trim().slice(0, 24);
  if (!clean) return;

  state.user         = clean;
  state.profile      = ensureProfile(clean);
  state.roleId       = _urlRole || null;

  // URL param overrides saved course; otherwise restore last visited course
  if (_urlCourse && COURSES[_urlCourse]) {
    state.courseId = _urlCourse;
  } else {
    state.courseId = state.profile.activeCourse || "python";
  }

  const isWorkspace = window.location.pathname.includes("mission.html");
  if (isWorkspace) {
    const _urlIndex = parseInt(_params.get("index"), 10);
    if (!isNaN(_urlIndex) && _urlIndex >= 0 && _urlIndex < missions().length) {
      // Security Lock Check: check if the requested mission is locked
      const prog = progress();
      const quests = missions();
      const isLocked = _urlIndex > 0 && !prog.solved[quests[_urlIndex - 1].id];
      if (isLocked) {
        // Automatically redirect back to the course dashboard
        const roleParam = state.roleId ? `&role=${state.roleId}` : "";
        window.location.href = `learn.html?course=${state.courseId}${roleParam}`;
        return;
      }
      state.missionIndex = _urlIndex;
    } else {
      state.missionIndex = progress().current || 0;
    }
  } else {
    state.missionIndex = progress().current || 0;
  }

  setActiveUser(clean);
  if (el.login) el.login.classList.add("hidden");
  render();
}

/* ── Bootstrap ───────────────────────────────────────────────── */
(function init() {
  const savedUser = getActiveUser();
  if (savedUser) {
    // Returning player — restore session silently
    el.nameInput.value = savedUser;
    signIn(savedUser);
  } else {
    // New visitor — show login overlay
    el.nameInput.focus();
  }
})();
