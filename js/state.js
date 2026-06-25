/**
 * state.js
 * ─────────────────────────────────────────────────────────────────────────
 * Single mutable application state object.
 *
 * All UI modules read from and write to this object — never maintain local
 * copies of courseId, missionIndex, etc.
 *
 * Fields:
 *   user         — current player name (string)
 *   profile      — full profile object loaded from localStorage (or null)
 *   courseId     — key into COURSES (e.g. "python")
 *   missionIndex — 0-based index into the current course's quests array
 *   roleId       — active career-path ID (e.g. "data-analyst") or null
 *   tab          — active mentor tab ("concept" | "pattern" | "loot")
 *   focus        — whether Focus Mode (hides the map) is active
 */

/* global state */
const state = {
  user:         "",
  profile:      null,
  courseId:     "python",
  missionIndex: 0,
  roleId:       null,
  tab:          "concept",
  focus:        false,
};

/* ── Convenience accessors ─────────────────────────────────── */

/** Returns the current course object from COURSES. */
function course() {
  return COURSES[state.courseId];
}

/** Returns the quests array for the current course. */
function missions() {
  return course().quests;
}

/** Returns the current quest object. */
function mission() {
  return missions()[state.missionIndex];
}

/**
 * Returns the progress sub-object for a given course.
 * Defaults to the active course if no argument is provided.
 * @param {string} [courseId]
 */
function progress(courseId = state.courseId) {
  return state.profile.courses[courseId];
}

/** Sums XP across all courses in the current profile. */
function totalXp() {
  return Object.values(state.profile.courses).reduce(
    (sum, item) => sum + item.xp,
    0
  );
}
