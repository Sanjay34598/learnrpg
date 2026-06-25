/**
 * storage.js
 * ─────────────────────────────────────────────────────────────────────────
 * All localStorage read / write operations.
 *
 * Keys:
 *   STORE_KEY   — JSON blob of all player profiles
 *   ACTIVE_KEY  — name of the last active player (for auto-login)
 *
 * Profile schema:
 *   {
 *     activeCourse: string,          // last chosen courseId
 *     courses: {
 *       [courseId]: {
 *         xp:       number,          // XP earned in this course
 *         streak:   number,          // current correct streak
 *         current:  number,          // last visited missionIndex
 *         solved:   { [questId]: true },
 *         attempts: { [questId]: string }  // last written answer text
 *       }
 *     }
 *   }
 */

const STORE_KEY  = "learnRpgProfilesV1";
const ACTIVE_KEY = "learnRpgActiveUserV1";

/** @returns {Object} All profiles keyed by player name. */
function readProfiles() {
  return JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
}

/** Persists all profiles to localStorage. */
function writeProfiles(profiles) {
  localStorage.setItem(STORE_KEY, JSON.stringify(profiles));
}

/** @returns {{xp, streak, current, solved, attempts}} Empty course progress object. */
function emptyProgress() {
  return { xp: 0, streak: 0, current: 0, solved: {}, attempts: {} };
}

/**
 * Loads or creates a profile for the given player name.
 * Ensures every known course has an initialised progress entry.
 * @param {string} name
 * @returns {Object} The player's profile.
 */
function ensureProfile(name) {
  const profiles = readProfiles();
  if (!profiles[name]) {
    profiles[name] = { activeCourse: "python", courses: {} };
  }
  // Add any newly created courses that don't yet exist in the saved profile
  Object.keys(COURSES).forEach((id) => {
    if (!profiles[name].courses[id]) {
      profiles[name].courses[id] = emptyProgress();
    }
  });
  profiles[name].activeCourse = profiles[name].activeCourse || "python";
  writeProfiles(profiles);
  return profiles[name];
}

/**
 * Writes the current in-memory state back to localStorage.
 * Call after any XP award, course switch, or mission navigation.
 */
function saveProfile() {
  if (!state.user || !state.profile) return;
  state.profile.activeCourse = state.courseId;
  progress().current = state.missionIndex;
  const profiles = readProfiles();
  profiles[state.user] = state.profile;
  writeProfiles(profiles);
}

/** Returns the player name stored from the last session, or null. */
function getActiveUser() {
  return localStorage.getItem(ACTIVE_KEY);
}

/** Persists the active player name for auto-login on next visit. */
function setActiveUser(name) {
  localStorage.setItem(ACTIVE_KEY, name);
}

/** Clears the active player name (used by the Switch button). */
function clearActiveUser() {
  localStorage.removeItem(ACTIVE_KEY);
}
