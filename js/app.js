const STORE = "learnrpg_profiles_v2";
const ACTIVE = "learnrpg_active_user_v2";

const state = { user: "", profile: null, courseId: "python", index: 0 };
const $ = id => document.getElementById(id);
const el = {
  login: $("login"), loginForm: $("loginForm"), nameInput: $("nameInput"),
  playerName: $("playerName"), profileMeta: $("profileMeta"), level: $("level"), xp: $("xp"), streak: $("streak"), xpFill: $("xpFill"),
  catalog: $("catalog"), missions: $("missions"), missionTitle: $("missionTitle"), missionSummary: $("missionSummary"), courseType: $("courseType"),
  map: $("map"), avatar: $("avatar"), chips: $("chips"), brief: $("brief"), terminal: $("terminal"), answers: $("answers"),
  mentor: $("mentor"), notes: $("notes"), nextMission: $("nextMission"), resetCourse: $("resetCourse"), switchUser: $("switchUser"), toast: $("toast")
};

function profiles() { return JSON.parse(localStorage.getItem(STORE) || "{}"); }
function writeProfiles(data) { localStorage.setItem(STORE, JSON.stringify(data)); }
function emptyProgress() { return { xp: 0, streak: 0, current: 0, solved: {}, attempts: {} }; }
function ensureProfile(name) {
  const data = profiles();
  if (!data[name]) data[name] = { activeCourse: "python", courses: {} };
  Object.keys(COURSES).forEach(id => { if (!data[name].courses[id]) data[name].courses[id] = emptyProgress(); });
  writeProfiles(data);
  return data[name];
}
function save() {
  if (!state.profile) return;
  state.profile.activeCourse = state.courseId;
  progress().current = state.index;
  const data = profiles();
  data[state.user] = state.profile;
  writeProfiles(data);
}
function course(id = state.courseId) { return COURSES[id]; }
function quests() { return course().quests; }
function quest() { return quests()[state.index]; }
function progress(id = state.courseId) { return state.profile.courses[id]; }
function totalXp() { return Object.values(state.profile.courses).reduce((sum, p) => sum + p.xp, 0); }
function esc(v) { return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }

function signIn(name) {
  const clean = name.trim().slice(0, 24);
  if (!clean) return;
  state.user = clean;
  state.profile = ensureProfile(clean);
  state.courseId = state.profile.activeCourse || "python";
  state.index = progress().current || 0;
  localStorage.setItem(ACTIVE, clean);
  el.login.classList.add("hidden");
  render();
}

function render() {
  const p = progress();
  if (state.index >= quests().length) state.index = 0;
  const item = quest();
  const solved = Boolean(p.solved[item.id]);
  el.playerName.textContent = state.user;
  el.profileMeta.textContent = `${totalXp()} total XP`;
  el.level.textContent = Math.max(1, Math.floor(totalXp() / 160) + 1);
  el.xp.textContent = p.xp;
  el.streak.textContent = p.streak;
  el.xpFill.style.width = `${Math.min(100, (p.xp % 160) / 160 * 100)}%`;
  el.missionTitle.textContent = item.title;
  el.missionSummary.textContent = course().tagline;
  el.courseType.textContent = `${course().name} / ${label(item.type)}`;
  el.chips.innerHTML = `<span class="chip">${item.difficulty}</span><span class="chip">${item.skill}</span><span class="chip">Reward: ${item.reward}</span>`;
  el.brief.innerHTML = `<strong>Mission:</strong> ${esc(item.prompt)}`;
  el.terminal.textContent = `${item.code}\n\n${solved ? item.output : "?"}`;
  el.nextMission.disabled = !solved;
  el.mentor.textContent = solved ? item.why : "Solve first. The explanation unlocks after your attempt.";
  renderCatalog();
  renderMissions();
  renderMap();
  renderAnswers(item, solved);
  renderNotes(item, solved);
}

function label(type) {
  return type === "code" ? "Code Mission" : type === "think" ? "Blank Reasoning Mission" : "Choice Mission";
}

function renderCatalog() {
  el.catalog.innerHTML = Object.entries(COURSES).map(([id, c]) => {
    const p = progress(id);
    const solved = Object.keys(p.solved).length;
    return `<button class="course ${id === state.courseId ? "active" : ""}" data-course="${id}">
      <span class="mark">${c.mark}</span><span><strong>${c.name}</strong><small>${solved}/${c.quests.length} missions</small></span><span class="course-xp">${p.xp} XP</span>
    </button>`;
  }).join("");
  el.catalog.querySelectorAll(".course").forEach(btn => btn.addEventListener("click", () => {
    state.courseId = btn.dataset.course;
    state.index = progress().current || 0;
    save(); render(); toast(`${course().name} loaded`);
  }));
}

function renderMissions() {
  const p = progress();
  el.missions.innerHTML = quests().map((item, i) => `<button class="mission ${i === state.index ? "active" : ""}" data-index="${i}">
    <span class="badge">${item.icon}</span><span><strong>${item.title}</strong><small>${item.subtitle}</small></span><span class="done">${p.solved[item.id] ? "Done" : item.type}</span>
  </button>`).join("");
  el.missions.querySelectorAll(".mission").forEach(btn => btn.addEventListener("click", () => {
    state.index = Number(btn.dataset.index); save(); render();
  }));
}

function renderMap() {
  const p = progress();
  el.map.querySelectorAll(".node").forEach(n => n.remove());
  el.map.insertAdjacentHTML("beforeend", quests().map((item, i) => `<button class="node ${i === state.index ? "active" : ""} ${p.solved[item.id] ? "done" : ""}" data-index="${i}" style="left:${item.pos[0]}%;top:${item.pos[1]}%">${i+1}</button>`).join(""));
  el.map.querySelectorAll(".node").forEach(btn => btn.addEventListener("click", () => {
    state.index = Number(btn.dataset.index); save(); render();
  }));
  el.avatar.style.setProperty("--x", `${quest().pos[0]}%`);
  el.avatar.style.setProperty("--y", `${quest().pos[1] + 10}%`);
}

function renderAnswers(item, solved) {
  if (item.type === "choice") {
    el.answers.innerHTML = item.choices.map((choice, i) => `<button class="answer ${solved && i === item.answer ? "correct" : ""}" data-index="${i}">${esc(choice)}</button>`).join("");
    el.answers.querySelectorAll(".answer").forEach(btn => {
      btn.disabled = solved;
      btn.addEventListener("click", () => answerChoice(Number(btn.dataset.index)));
    });
    return;
  }
  const prior = progress().attempts[item.id] || "";
  el.answers.innerHTML = `<p>${item.type === "code" ? "Write code/formula. The offline checker looks for key ideas." : "Write your reasoning before unlocking the mentor answer."}</p>
    <textarea id="written" ${solved ? "disabled" : ""}>${esc(prior)}</textarea>
    <button class="primary" id="submitWritten" ${solved ? "disabled" : ""}>Submit</button>`;
  const submit = $("submitWritten");
  if (submit) submit.addEventListener("click", submitWritten);
}

function renderNotes(item, solved) {
  el.notes.innerHTML = `<h3>${esc(item.title)}</h3><p>${esc(item.concept)}</p><pre>${esc(item.example)}</pre><p><strong>Pattern:</strong> ${esc(item.pattern)}</p><p>${solved ? esc(item.why) : "Complete the mission to reveal the exact reasoning."}</p>`;
}

function answerChoice(i) {
  const item = quest();
  if (i === item.answer) award(item, 45);
  else {
    progress().streak = 0; save(); render(); toast("Close. Try one line at a time.");
  }
}

function submitWritten() {
  const item = quest();
  const text = ($("written")?.value || "").trim();
  if (!text) return toast("Put a real attempt on the board first.");
  progress().attempts[item.id] = text;
  if (item.type === "think") {
    if (text.length < (item.minLength || 30)) { progress().streak = 0; save(); return toast("Go deeper. Explain the why."); }
    return award(item, 55);
  }
  const normalized = text.toLowerCase().replace(/\s+/g, " ");
  const missing = (item.checks || []).find(check => !normalized.includes(check.toLowerCase()));
  if (missing) { progress().streak = 0; save(); return toast(`Missing idea: ${missing}`); }
  award(item, 70);
}

function award(item, amount) {
  const p = progress();
  if (!p.solved[item.id]) {
    p.solved[item.id] = true;
    p.streak += 1;
    p.xp += amount + Math.min(60, p.streak * 5);
    toast(`${item.reward} unlocked`);
  }
  save(); render();
}

function toast(msg) {
  el.toast.textContent = msg;
  el.toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => el.toast.classList.remove("show"), 1600);
}

el.loginForm.addEventListener("submit", e => { e.preventDefault(); signIn(el.nameInput.value); });
el.switchUser.addEventListener("click", () => { localStorage.removeItem(ACTIVE); el.login.classList.remove("hidden"); el.nameInput.focus(); });
el.resetCourse.addEventListener("click", () => { state.profile.courses[state.courseId] = emptyProgress(); state.index = 0; save(); render(); toast("Course reset"); });
el.nextMission.addEventListener("click", () => { state.index = (state.index + 1) % quests().length; save(); render(); });

const active = localStorage.getItem(ACTIVE);
if (active) { el.nameInput.value = active; signIn(active); } else { el.nameInput.focus(); }
