/**
 * events.js
 * ─────────────────────────────────────────────────────────────────────────
 * Attaches all persistent event listeners that are wired once at startup.
 * (Per-mission listeners like answer buttons are re-attached inside render.js.)
 *
 * Listeners registered here:
 *   loginForm    submit  — sign in
 *   switchUser   click   — return to login screen
 *   nextMission  click   — advance to the next quest
 *   resetCourse  click   — wipe course progress
 *   mapMode      click   — switch to quest-map view
 *   focusMode    click   — switch to focus view (hides map)
 *   tabs buttons click   — switch mentor codex tab
 */

/* ── Login ────────────────────────────────────────────────────── */

if (el.loginForm) {
  el.loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    signIn(el.nameInput.value);
  });
}

/* ── Switch user ─────────────────────────────────────────────── */

if (el.switchUser) {
  el.switchUser.addEventListener("click", () => {
    clearActiveUser();
    el.login.classList.remove("hidden");
    el.nameInput.value = "";
    el.nameInput.focus();
  });
}

/* ── Mission navigation ──────────────────────────────────────── */

if (el.nextMission) {
  el.nextMission.addEventListener("click", () => {
    state.missionIndex = (state.missionIndex + 1) % missions().length;
    saveProfile();
    render();
  });
}

/* ── Reset course ────────────────────────────────────────────── */

if (el.resetCourse) {
  el.resetCourse.addEventListener("click", () => {
    state.profile.courses[state.courseId] = emptyProgress();
    state.missionIndex = 0;
    saveProfile();
    render();
    toast(`${course().name} progress reset`);
  });
}

/* ── View mode toggle ────────────────────────────────────────── */

if (el.mapMode && el.focusMode && el.workspace && el.map) {
  el.mapMode.addEventListener("click", () => {
    state.focus = false;
    el.mapMode.classList.add("active");
    el.focusMode.classList.remove("active");
    el.workspace.style.gridTemplateColumns = "";
    el.map.style.display = "";
  });

  el.focusMode.addEventListener("click", () => {
    state.focus = true;
    el.focusMode.classList.add("active");
    el.mapMode.classList.remove("active");
    el.workspace.style.gridTemplateColumns = "minmax(0, 1fr)";
    el.map.style.display = "none";
  });
}


/* ── Mentor codex tabs ───────────────────────────────────────── */

document.querySelectorAll(".tabs button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tabs button").forEach((tab) =>
      tab.classList.remove("active")
    );
    button.classList.add("active");
    state.tab = button.dataset.tab;
    render();
  });
});
