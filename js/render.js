/**
 * render.js
 * ─────────────────────────────────────────────────────────────────────────
 * All DOM-building functions.
 *
 * render()           — master re-render: calls every sub-renderer
 * renderCatalog()    — left panel course list
 * renderMissionList()— left panel mission list
 * renderMap()        — quest-map nodes + avatar position
 * renderAnswerArea() — choice buttons | code textarea | think textarea
 * renderCodex()      — right mentor panel (concept / pattern / loot)
 *
 * Helper utilities:
 *   esc(value)               — HTML-escape a string
 *   labelForType(type)       — human-readable mission type label
 *   terminalFor(item, solved, error) — terminal display HTML
 *
 * Toast:
 *   toast(message)           — show brief notification overlay
 */

/* ── Cached DOM refs ─────────────────────────────────────────── */
const el = {
  login:         document.getElementById("login"),
  loginForm:     document.getElementById("loginForm"),
  nameInput:     document.getElementById("nameInput"),
  appTitle:      document.getElementById("appTitle"),
  tagline:       document.getElementById("tagline"),
  player:        document.getElementById("player"),
  playerMeta:    document.getElementById("playerMeta"),
  level:         document.getElementById("level"),
  courseXp:      document.getElementById("courseXp"),
  streak:        document.getElementById("streak"),
  xpFill:        document.getElementById("xpFill"),
  catalog:       document.getElementById("catalog"),
  missions:      document.getElementById("missions"),
  missionTitle:  document.getElementById("missionTitle"),
  missionSummary:document.getElementById("missionSummary"),
  map:           document.getElementById("map"),
  avatar:        document.getElementById("avatar"),
  workspace:     document.getElementById("workspace"),
  chips:         document.getElementById("chips"),
  brief:         document.getElementById("brief"),
  terminal:      document.getElementById("terminal"),
  answers:       document.getElementById("answers"),
  resetCourse:   document.getElementById("resetCourse"),
  nextMission:   document.getElementById("nextMission"),
  switchUser:    document.getElementById("switchUser"),
  mapMode:       document.getElementById("mapMode"),
  focusMode:     document.getElementById("focusMode"),
  mentorLine:    document.getElementById("mentorLine"),
  codex:         document.getElementById("codex"),
  toast:         document.getElementById("toast"),
};

/* ── Helpers ─────────────────────────────────────────────────── */

/** HTML-escapes a value for safe innerHTML insertion. */
function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/** Human-readable label for a quest type. */
function labelForType(type) {
  if (type === "code")  return "Code mission";
  if (type === "think") return "Blank mission";
  return "Choice mission";
}

/**
 * Returns the terminal inner HTML for the current state.
 * @param {Object}  item   — current quest
 * @param {boolean} solved
 * @param {string}  [error]
 */
function terminalFor(item, solved, error) {
  if (error) {
    return `<span class="prompt">&gt;&gt;&gt;</span> ${esc(item.code)}\n<span class="err">${esc(error)}</span>`;
  }
  if (solved) {
    return `<span class="prompt">&gt;&gt;&gt;</span> ${esc(item.code)}\n<span class="out">${esc(item.output)}</span>`;
  }
  return `<span class="prompt">&gt;&gt;&gt;</span> ${esc(item.code)}\n<span class="out">?</span>`;
}

/* ── Master render ───────────────────────────────────────────── */

/** Helper to check if we are on the workspace page */
function isWorkspacePage() {
  return window.location.pathname.includes("mission.html");
}

/** Syncs URL parameters dynamically without page reloads */
function syncUrlParams() {
  const params = new URLSearchParams(window.location.search);
  params.set("course", state.courseId);
  params.set("index", state.missionIndex);
  if (state.roleId) {
    params.set("role", state.roleId);
  } else {
    params.delete("role");
  }
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", newUrl);
}

/**
 * Full re-render. Call whenever state changes.
 * Guards against an uninitialised profile.
 */
function render() {
  if (!state.profile) return;
  if (state.missionIndex >= missions().length) state.missionIndex = 0;

  const item        = mission();
  const prog        = progress();
  const solved      = Boolean(prog.solved[item.id]);
  const solvedCount = Object.keys(prog.solved).length;

  // Sync URL params on workspace page
  if (isWorkspacePage()) {
    syncUrlParams();
  }

  // Header / sidebar stats
  if (el.appTitle) el.appTitle.textContent      = `${course().name} Quest`;
  if (el.tagline) el.tagline.textContent       = course().tagline;
  if (el.player) el.player.textContent        = state.user;
  if (el.playerMeta) el.playerMeta.textContent    = `${totalXp()} total XP across catalog`;
  
  // Update levels / stats on all available elements (including topbar)
  document.querySelectorAll("#level").forEach(node => node.textContent = Math.max(1, Math.floor(totalXp() / 160) + 1));
  document.querySelectorAll("#courseXp").forEach(node => node.textContent = prog.xp);
  document.querySelectorAll("#streak").forEach(node => node.textContent = prog.streak);
  if (el.xpFill) el.xpFill.style.width        = `${Math.min(100, (prog.xp % 160) / 160 * 100)}%`;

  // Dashboard specific header elements
  const activeCourseName = document.getElementById("activeCourseName");
  const activeCourseTagline = document.getElementById("activeCourseTagline");
  if (activeCourseName) activeCourseName.textContent = `${course().name} Missions`;
  if (activeCourseTagline) activeCourseTagline.textContent = course().tagline;

  // Arena header
  if (el.missionTitle) el.missionTitle.textContent   = item.title;
  if (el.missionSummary) el.missionSummary.textContent = item.summary;

  // Chips
  if (el.chips) {
    el.chips.innerHTML = [
      `<span class="chip">${item.difficulty}</span>`,
      `<span class="chip">${item.skill}</span>`,
      `<span class="chip">${labelForType(item.type)}</span>`,
      `<span class="chip">Reward: ${item.reward}</span>`,
    ].join("");
  }

  // Brief + terminal
  if (el.brief) el.brief.innerHTML    = `<strong>Mission:</strong> ${esc(item.prompt)}`;
  if (el.terminal) el.terminal.innerHTML = terminalFor(item, solved);

  // Next mission button
  if (el.nextMission) el.nextMission.disabled = !solved;

  // Mentor line
  if (el.mentorLine) el.mentorLine.textContent = `${solvedCount} of ${missions().length} ${course().name} missions cleared. XP is saved for ${state.user}.`;

  if (el.catalog) renderCatalog();
  if (el.missions) renderMissionList();
  if (el.map) renderMap();
  if (el.answers) renderAnswerArea(item, solved);
  if (el.codex) renderCodex(item, solved);
}

/* ── Sub-renderers ───────────────────────────────────────────── */

/** Renders the catalog (course list) in the left panel.
 *  If state.roleId is set, shows sections from that role.
 *  Otherwise shows a flat list of all courses.
 */
function renderCatalog() {
  if (!el.catalog) return;

  // ── Role-organized view ───────────────────────────────────────
  if (state.roleId && typeof ROLES !== "undefined" && ROLES[state.roleId]) {
    const role = ROLES[state.roleId];
    let html = `<div class="catalog-role-header">
      <span class="catalog-role-name">${role.emoji} ${role.title} Path</span>
      <a href="role.html?id=${role.id}" class="catalog-role-link">View all →</a>
    </div>`;

    role.sections.forEach((section) => {
      html += `<div class="catalog-section">
        <div class="catalog-section-title">${section.emoji} ${section.name}</div>`;

      section.courses.forEach((courseId) => {
        const item = COURSES[courseId];
        if (!item) return;
        const prog  = progress(courseId);
        const count = Object.keys(prog.solved).length;
        const total = item.quests.length;
        const done  = count >= total;
        html += `<button class="course ${courseId === state.courseId ? "active" : ""} ${done ? "course-done" : ""}" data-course="${courseId}">
          <span class="mark">${item.mark}</span>
          <span><strong>${item.name}</strong><small>${count}/${total} cleared</small></span>
          <span class="course-xp">${done ? "✓" : prog.xp + " XP"}</span>
        </button>`;
      });

      html += `</div>`;
    });

    el.catalog.innerHTML = html;
  } else {
    // ── Flat view (no role selected) ──────────────────────────
    el.catalog.innerHTML = Object.entries(COURSES)
      .map(([id, item]) => {
        const prog  = progress(id);
        const count = Object.keys(prog.solved).length;
        return `<button class="course ${id === state.courseId ? "active" : ""}" data-course="${id}">
          <span class="mark">${item.mark}</span>
          <span><strong>${item.name}</strong><small>${count}/${item.quests.length} missions cleared</small></span>
          <span class="course-xp">${prog.xp} XP</span>
        </button>`;
      })
      .join("");
  }

  el.catalog.querySelectorAll(".course").forEach((button) => {
    button.addEventListener("click", () => {
      state.courseId     = button.dataset.course;
      state.missionIndex = progress().current || 0;
      saveProfile();
      render();
      toast(`${course().name} catalog loaded`);
    });
  });
}

/** Renders the mission list in the left panel.
 *  Missions are locked (disabled) until the previous mission is solved.
 */
function renderMissionList() {
  if (!el.missions) return;

  const prog   = progress();
  const quests = missions();

  el.missions.innerHTML = quests
    .map((item, index) => {
      const solved   = Boolean(prog.solved[item.id]);
      // Mission 0 always available; mission N available only if N-1 is solved
      const isLocked = index > 0 && !prog.solved[quests[index - 1].id];
      const isActive = index === state.missionIndex;

      const statusLabel = solved
        ? "Done"
        : isLocked
        ? "🔒 Locked"
        : labelForType(item.type).split(" ")[0];

      return `<button
          class="mission ${isActive ? "active" : ""} ${isLocked ? "locked" : ""} ${solved ? "solved" : ""}"
          data-index="${index}"
          ${isLocked ? "disabled" : ""}
          title="${isLocked ? "Complete the previous mission first" : item.summary}">
          <span class="badge">${isLocked ? "🔒" : item.icon}</span>
          <span><strong>${item.title}</strong><small>${item.subtitle}</small></span>
          <span class="done">${statusLabel}</span>
        </button>`;
    })
    .join("");

  el.missions.querySelectorAll(".mission:not([disabled])").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      state.missionIndex = index;
      saveProfile();
      if (isWorkspacePage()) {
        render();
      } else {
        const roleParam = state.roleId ? `&role=${state.roleId}` : "";
        window.location.href = `mission.html?course=${state.courseId}&index=${index}${roleParam}`;
      }
    });
  });
}

/** Renders the quest-map nodes and moves the avatar.
 *  Locked nodes (previous unsolved) show a lock and are not clickable.
 */
function renderMap() {
  if (!el.map) return;

  const prog   = progress();
  const quests = missions();

  // Remove old nodes (keep .path and .avatar)
  el.map.querySelectorAll(".node").forEach((node) => node.remove());

  el.map.insertAdjacentHTML(
    "beforeend",
    quests
      .map((item, index) => {
        const solved   = Boolean(prog.solved[item.id]);
        const isLocked = index > 0 && !prog.solved[quests[index - 1].id];
        return `<button
            class="node ${index === state.missionIndex ? "active" : ""} ${solved ? "done" : ""} ${isLocked ? "locked" : ""}"
            data-index="${index}"
            ${isLocked ? "disabled" : ""}
            title="${isLocked ? "Complete mission " + index + " first" : item.title}"
            style="left:${item.pos[0]}%; top:${item.pos[1]}%;">
            ${isLocked ? "🔒" : index + 1}
          </button>`;
      })
      .join("")
  );

  el.map.querySelectorAll(".node:not([disabled])").forEach((node) => {
    node.addEventListener("click", () => {
      state.missionIndex = Number(node.dataset.index);
      saveProfile();
      render();
    });
  });

  const pos = mission().pos;
  el.avatar.style.setProperty("--x", `${pos[0]}%`);
  el.avatar.style.setProperty("--y", `${pos[1] + 10}%`);
}

/**
 * Renders the answer area — multiple choice, code textarea, or think textarea.
 * @param {Object}  item
 * @param {boolean} solved
 */
function renderAnswerArea(item, solved) {
  if (!el.answers) return;

  if (item.type === "choice") {
    el.answers.innerHTML = item.choices
      .map(
        (choice, index) =>
          `<button class="answer ${solved && index === item.answer ? "correct" : ""}" data-index="${index}">${esc(choice)}</button>`
      )
      .join("");

    el.answers.querySelectorAll(".answer").forEach((button) => {
      button.disabled = solved;
      button.addEventListener("click", () =>
        answerChoice(Number(button.dataset.index))
      );
    });
    return;
  }

  const hint = item.type === "code"
    ? "Write code here. The offline checker looks for the important ideas, so formatting can be simple."
    : "No options this time. Write your own reasoning before the mentor answer unlocks.";
  const placeholder = item.type === "code" ? "Type code here..." : "Type your reasoning here...";
  const prior = progress().attempts[item.id] || "";

  el.answers.innerHTML = `<div class="hint">${hint}</div>
    <textarea class="textarea" id="writtenAnswer" ${solved ? "disabled" : ""} placeholder="${placeholder}">${esc(solved ? prior : "")}</textarea>
    <button class="primary" id="submitWritten" ${solved ? "disabled" : ""}>Submit</button>`;

  const submit = document.getElementById("submitWritten");
  if (submit) submit.addEventListener("click", submitWritten);
}

/**
 * Renders the mentor codex panel (concept / pattern / loot).
 * @param {Object}  item
 * @param {boolean} solved
 */
function renderCodex(item, solved) {
  if (!el.codex) return;

  if (state.tab === "loot") {
    const prog = progress();
    el.codex.innerHTML = `<h4>${course().name} Loot</h4>
      <div class="loot-grid">${missions()
        .map((q) => `<div class="loot ${prog.solved[q.id] ? "active" : ""}" title="${q.reward}">${q.icon}</div>`)
        .join("")}</div>
      <p style="margin-top:14px;">Each reward marks a mental model you can use outside the game.</p>`;
    return;
  }

  if (state.tab === "pattern") {
    el.codex.innerHTML = `<h4>${esc(item.subtitle)}</h4><p>${esc(item.pattern)}</p><pre>${esc(item.example)}</pre><div class="note">${solved ? esc(item.why) : "Solve the mission to reveal the exact reasoning."}</div>`;
    return;
  }

  // "concept" tab (default)
  const locked = item.type === "code"
    ? "Write code first. The mentor answer unlocks after a valid attempt."
    : item.type === "think"
    ? "This one is intentionally blank. Your explanation unlocks the mentor answer."
    : "Pick the output you think the program will produce.";

  el.codex.innerHTML = `<h4>${esc(item.title)}</h4><p>${esc(item.concept)}</p><pre>${esc(item.code)}</pre><div class="note">${solved ? esc(item.why) : locked}</div>`;
}

/* ── Scoring logic ───────────────────────────────────────────── */

/**
 * Awards XP for solving a quest. If already solved, shows a "clean replay" toast.
 * @param {Object} item   — the quest
 * @param {number} amount — base XP to award
 */
function award(item, amount) {
  const prog = progress();
  if (!prog.solved[item.id]) {
    prog.solved[item.id] = true;
    prog.streak += 1;
    prog.xp += amount + Math.min(60, prog.streak * 5);
    toast(`Solved: ${item.reward} unlocked`);
  } else {
    toast("Clean replay");
  }
  saveProfile();
  render();
}

/**
 * Handles a multiple-choice selection.
 * @param {number} index — chosen option index
 */
function answerChoice(index) {
  const item    = mission();
  const buttons = [...el.answers.querySelectorAll(".answer")];

  if (index === item.answer) {
    buttons[index].classList.add("correct");
    award(item, 45);
  } else {
    buttons[index].classList.add("wrong");
    progress().streak = 0;
    saveProfile();
    el.terminal.innerHTML = terminalFor(item, false, "Try again. Trace the code one step at a time.");
    toast("Close. Think one line at a time.");
  }
}

/** Handles submission of a written (code or think) answer. */
function submitWritten() {
  const item = mission();
  const box  = document.getElementById("writtenAnswer");
  const text = box ? box.value.trim() : "";

  if (!text) {
    toast("Put a real attempt on the board first.");
    return;
  }

  progress().attempts[item.id] = text;

  if (item.type === "think") {
    if (text.length < (item.minLength || 24)) {
      progress().streak = 0;
      saveProfile();
      toast("Go deeper. Explain the why, not just the answer.");
      return;
    }
    award(item, 55);
    return;
  }

  // Code mission — keyword check
  const normalized = text.toLowerCase().replace(/\s+/g, " ");
  const missing    = item.checks.find((check) => !normalized.includes(check.toLowerCase()));

  if (missing) {
    progress().streak = 0;
    saveProfile();
    el.terminal.innerHTML = terminalFor(item, false, `Not yet. Missing idea: ${missing}`);
    toast("Good attempt. Add the missing idea and try again.");
    return;
  }

  award(item, 70);
}

/* ── Toast ───────────────────────────────────────────────────── */

let toastTimer = null;

/**
 * Shows a brief toast notification at the bottom of the screen.
 * @param {string} message
 */
function toast(message) {
  el.toast.textContent = message;
  el.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove("show"), 1700);
}
