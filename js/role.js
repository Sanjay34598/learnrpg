/**
 * role.js
 * ─────────────────────────────────────────────────────────────────────────
 * Role detail page logic:
 *   1. Read ?id= from URL to identify the role.
 *   2. Render the hero section (title, description, progress).
 *   3. Render each learning section with its course cards.
 *
 * Each course card links to: learn.html?course=<courseId>&role=<roleId>
 *
 * Depends on: courses.js, roles.js, storage.js, state.js
 */

/* ── Colour palette for marks ────────────────────────────────── */
const MARK_PALETTE = [
  "#147a80", "#2f7d5b", "#b8563f",
  "#6e496f", "#3b6f9e", "#d99a2b",
];
let _markIndex = 0;
function nextMark() {
  return MARK_PALETTE[(_markIndex++) % MARK_PALETTE.length];
}

/* ── Storage helpers (mirrors storage.js but standalone) ─────── */
function readProfiles() {
  try { return JSON.parse(localStorage.getItem("learnRpgProfilesV1") || "{}"); }
  catch { return {}; }
}

function getActiveUser() {
  return localStorage.getItem("learnRpgActiveUserV1") || null;
}

/**
 * Returns progress for a given courseId from the saved profile.
 * @param {string} courseId
 * @returns {{ xp: number, solved: Object, streak: number }}
 */
function getCourseProgress(courseId) {
  const username = getActiveUser();
  if (!username) return { xp: 0, solved: {}, streak: 0, attempts: {} };
  const profiles = readProfiles();
  const profile  = profiles[username];
  if (!profile || !profile.courses) return { xp: 0, solved: {}, streak: 0, attempts: {} };
  return profile.courses[courseId] || { xp: 0, solved: {}, streak: 0, attempts: {} };
}

/* ── Hero rendering ──────────────────────────────────────────── */
function renderHero(role) {
  document.title = `LearnRPG — ${role.title}`;

  // Apply role colour as CSS custom property
  document.documentElement.style.setProperty("--role-color", role.color);

  document.getElementById("roleIcon").textContent    = role.emoji;
  document.getElementById("roleName").textContent    = role.title;
  document.getElementById("roleTagline").textContent = role.tagline;
  document.getElementById("roleDesc").textContent    = role.description;

  // Compute aggregate stats across all courses in this role
  let totalXp      = 0;
  let solvedCount  = 0;
  let totalMissions = 0;

  role.sections.forEach((section) => {
    section.courses.forEach((courseId) => {
      const course = COURSES[courseId];
      if (!course) return;
      totalMissions += course.quests.length;
      const prog    = getCourseProgress(courseId);
      totalXp      += prog.xp || 0;
      solvedCount  += Object.keys(prog.solved || {}).length;
    });
  });

  const pct = totalMissions > 0 ? Math.round((solvedCount / totalMissions) * 100) : 0;

  document.getElementById("progressPct").textContent   = `${pct}%`;
  document.getElementById("progressFill").style.width  = `${pct}%`;
  document.getElementById("xpChip").textContent        = `⚡ ${totalXp} XP`;
  document.getElementById("missionsChip").textContent  = `✅ ${solvedCount}/${totalMissions} missions`;
}

/* ── Section + course card rendering ────────────────────────── */
function renderSections(role) {
  const container = document.getElementById("pathContainer");
  container.innerHTML = "";

  role.sections.forEach((section, sectionIndex) => {
    // Compute section progress
    let secSolved = 0;
    let secTotal  = 0;

    section.courses.forEach((courseId) => {
      const course = COURSES[courseId];
      if (!course) return;
      secTotal  += course.quests.length;
      const prog = getCourseProgress(courseId);
      secSolved += Object.keys(prog.solved || {}).length;
    });

    // Build course cards for this section
    const courseCards = section.courses.map((courseId) => {
      const course = COURSES[courseId];
      if (!course) return "";

      const prog     = getCourseProgress(courseId);
      const xp       = prog.xp || 0;
      const solved   = Object.keys(prog.solved || {}).length;
      const total    = course.quests.length;
      const done     = solved >= total && total > 0;
      const color    = nextMark();

      return `
        <a class="course-card ${done ? "completed" : ""}"
           href="learn.html?course=${courseId}&role=${role.id}"
           title="Start ${course.name}">
          <div class="course-card-stripe"></div>
          <div class="course-card-inner">
            <div class="course-card-top">
              <div class="course-mark" style="background:${color};">${course.mark}</div>
              <div class="course-card-check">${done ? "✓" : ""}</div>
            </div>
            <div class="course-card-name">${course.name}</div>
            <div class="course-card-tagline">${course.tagline}</div>
          </div>
          <div class="course-card-footer">
            <span class="course-xp">${xp > 0 ? `⚡ ${xp} XP` : "0 XP"}</span>
            <span class="course-missions">${solved}/${total} missions</span>
          </div>
        </a>`;
    }).join("");

    const sectionEl = document.createElement("div");
    sectionEl.className = "path-section";
    sectionEl.innerHTML = `
      <div class="section-header">
        <div class="section-number">${sectionIndex + 1}</div>
        <div class="section-info">
          <div class="section-emoji-title">
            <span class="section-emoji">${section.emoji}</span>
            <span class="section-name">${section.name}</span>
          </div>
          <div class="section-desc">${section.description}</div>
          <div class="section-progress">${secSolved}/${secTotal} missions completed</div>
        </div>
      </div>
      <div class="courses-grid">${courseCards}</div>`;

    container.appendChild(sectionEl);
  });
}

/* ── Bootstrap ───────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const roleId = params.get("id");
  const role   = roleId && ROLES[roleId];

  if (!role) {
    document.getElementById("roleHero").style.display    = "none";
    document.getElementById("pathContainer").style.display = "none";
    document.getElementById("errorState").style.display  = "flex";
    return;
  }

  // Update back button with a sensible label
  const backBtn = document.getElementById("backBtn");
  if (backBtn) backBtn.textContent = "← All Paths";

  renderHero(role);
  renderSections(role);
});
