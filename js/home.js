/**
 * home.js
 * ─────────────────────────────────────────────────────────────────────────
 * Landing page logic:
 *   - Render role cards from ROLES into #rolesGrid
 *   - Show per-user XP progress on each card (if a returning player exists)
 *
 * Depends on: courses.js, roles.js, storage.js, state.js (for COURSES/ROLES globals)
 */

/* ── Colour palette for course marks ────────────────────────── */
const MARK_COLORS = [
  "#147a80", "#2f7d5b", "#b8563f",
  "#6e496f", "#3b6f9e", "#d99a2b",
];

function markColor(index) {
  return MARK_COLORS[index % MARK_COLORS.length];
}

/* ── Load player progress (if any saved user) ────────────────── */
function getPlayerProfiles() {
  try {
    return JSON.parse(localStorage.getItem("learnRpgProfilesV1") || "{}");
  } catch {
    return {};
  }
}

function getActiveUsername() {
  return localStorage.getItem("learnRpgActiveUserV1") || null;
}

/**
 * For a given role, return { totalXp, solvedCount, totalMissions }
 * using the saved profile (if any).
 */
function roleSummary(role) {
  const username = getActiveUsername();
  if (!username) return { totalXp: 0, solvedCount: 0, totalMissions: 0 };

  const profiles = getPlayerProfiles();
  const profile  = profiles[username];
  if (!profile) return { totalXp: 0, solvedCount: 0, totalMissions: 0 };

  let totalXp      = 0;
  let solvedCount  = 0;
  let totalMissions = 0;

  role.sections.forEach((section) => {
    section.courses.forEach((courseId) => {
      const course = COURSES[courseId];
      if (!course) return;
      totalMissions += course.quests.length;
      const prog = profile.courses && profile.courses[courseId];
      if (prog) {
        totalXp     += prog.xp || 0;
        solvedCount += Object.keys(prog.solved || {}).length;
      }
    });
  });

  return { totalXp, solvedCount, totalMissions };
}

/* ── Render ──────────────────────────────────────────────────── */
function renderRoleCards() {
  const grid = document.getElementById("rolesGrid");
  if (!grid) return;

  grid.innerHTML = Object.values(ROLES)
    .map((role) => {
      const { totalXp, solvedCount, totalMissions } = roleSummary(role);
      const pct = totalMissions > 0 ? Math.round((solvedCount / totalMissions) * 100) : 0;

      const skillTags = role.skills
        .map((s) => `<span class="skill-tag">${s}</span>`)
        .join("");

      const progressBar = totalXp > 0
        ? `<div class="role-card-progress-wrap">
             <div style="display:flex;justify-content:space-between;font-size:11px;font-weight:700;color:rgba(248,250,252,0.45);margin-bottom:5px;">
               <span>${solvedCount}/${totalMissions} missions</span><span>${pct}%</span>
             </div>
             <div style="height:3px;background:rgba(255,255,255,0.08);border-radius:999px;overflow:hidden;">
               <div style="height:100%;width:${pct}%;background:${role.color};border-radius:999px;"></div>
             </div>
           </div>`
        : "";

      return `
        <a class="role-card" href="role.html?id=${role.id}" id="roleCard-${role.id}">
          <div class="role-card-header" style="background:${role.gradient};"></div>
          <div class="role-card-body">
            <div class="role-card-icon">${role.emoji}</div>
            <div class="role-card-title">${role.title}</div>
            <div class="role-card-tagline">${role.tagline}</div>
            <div class="role-card-skills">${skillTags}</div>
            ${progressBar}
            <div class="role-card-meta">
              <span class="role-card-difficulty">${role.difficulty}</span>
              <span class="role-card-duration">⏱ ${role.duration}</span>
              <span class="role-card-arrow">→</span>
            </div>
          </div>
        </a>`;
    })
    .join("");

  // Add hover glow effect matching each role's colour
  document.querySelectorAll(".role-card").forEach((card) => {
    const roleId = card.id.replace("roleCard-", "");
    const role   = ROLES[roleId];
    if (!role) return;

    card.addEventListener("mouseenter", () => {
      card.style.boxShadow = `0 0 32px ${role.color}28, 0 8px 24px rgba(0,0,0,0.4)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.boxShadow = "";
    });
  });
}

/* ── Bootstrap ───────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", renderRoleCards);
