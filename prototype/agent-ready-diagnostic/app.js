const sections = [
  ["cover", "交付封面", "客户、目标、摘要"],
  ["score", "诊断评分", "9 项 Agent-ready 评估"],
  ["actions", "行动清单", "风险、优先级、下一步"],
  ["evidence", "证据附录", "页面、流程、数据、权限"],
  ["report", "报告导出", "Markdown / JSON"]
];

let checks = [];
let integrations = [];
let state = {
  activeId: null,
  projects: [],
  reportText: "",
  isSaving: false,
  lastSavedAt: null,
  error: ""
};
let saveTimer = null;

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers || {})
    }
  });
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();
  const body = contentType.includes("application/json") && text ? JSON.parse(text) : text;
  if (!response.ok) {
    const message = typeof body === "object" && body?.error ? body.error : text || response.statusText;
    throw new Error(message);
  }
  return body;
}

async function boot() {
  try {
    const schema = await api("/api/schema");
    checks = schema.checks || [];
    integrations = schema.integrations || [];
    const list = await api("/api/projects");
    state.projects = list.projects || [];
    if (!state.projects.length) {
      const created = await api("/api/projects", {
        method: "POST",
        body: JSON.stringify({ project: {} })
      });
      state.projects = [created.project];
    }
    state.activeId = state.projects[0].id;
    render();
    await refreshReport();
  } catch (error) {
    state.error = error.message;
    renderFatal(error);
  }
}

function active() {
  return state.projects.find((project) => project.id === state.activeId) || state.projects[0] || null;
}

function replaceActive(project) {
  const index = state.projects.findIndex((item) => item.id === project.id);
  if (index === -1) state.projects.unshift(project);
  else Object.assign(state.projects[index], project);
  state.activeId = project.id;
}

function scheduleSave({ refresh = false, rerender = false } = {}) {
  const project = active();
  if (!project) return;
  project.updatedAt = new Date().toISOString();
  state.isSaving = true;
  renderCover(project);
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => persistActive({ refresh, rerender }), 350);
}

async function flushSave({ refresh = false, rerender = false } = {}) {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  if (state.isSaving) await persistActive({ refresh, rerender });
}

async function persistActive({ refresh = false, rerender = false } = {}) {
  const project = active();
  if (!project) return;
  try {
    const saved = await api(`/api/projects/${encodeURIComponent(project.id)}`, {
      method: "PUT",
      body: JSON.stringify({ project })
    });
    replaceActive(saved.project);
    state.isSaving = false;
    state.lastSavedAt = new Date();
    state.error = "";
    if (refresh) await refreshReport();
    if (rerender) render();
    else renderCover(active());
  } catch (error) {
    state.isSaving = false;
    state.error = error.message;
    render();
  }
}

async function refreshReport() {
  const project = active();
  if (!project) return;
  state.reportText = await api(`/api/projects/${encodeURIComponent(project.id)}/report`, {
    headers: { accept: "text/markdown" }
  });
  if (project.section === "report") renderReportScreen(project);
}

function score(project = active()) {
  if (!project) return { points: 0, max: 100, percent: 0, answered: 0, missing: 0 };
  if (project.computed?.score) return project.computed.score;
  let points = 0;
  let answered = 0;
  let missing = 0;
  checks.forEach((check) => {
    const answer = project.answers?.[check.id] || {};
    if (answer.score !== "") {
      answered += 1;
      points += (Number(answer.score) / 5) * check.weight;
      if (!String(answer.evidence || "").trim()) missing += 1;
    }
  });
  const max = checks.reduce((sum, check) => sum + check.weight, 0);
  return { points: Math.round(points), max, percent: Math.round((points / max) * 100), answered, missing };
}

function status(percent, answered) {
  if (!answered) return ["待评估", "var(--green)"];
  if (percent < 35) return ["基础未就绪", "var(--red)"];
  if (percent < 60) return ["重点流程改造", "var(--amber)"];
  if (percent < 82) return ["可进入试点", "var(--blue)"];
  return ["高度就绪", "var(--green)"];
}

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderFatal(error) {
  document.querySelector("#screen-cover").innerHTML = `
    <div class="panel">
      <div class="panel-head"><div><h3>服务未就绪</h3><p class="sub">工具台需要连接后端 API 后才能使用。</p></div></div>
      <div class="content"><div class="empty">${esc(error.message)}</div></div>
    </div>`;
}

function render() {
  const project = active();
  if (!project) return;
  renderNav(project);
  renderCover(project);
  document.querySelectorAll(".screen").forEach((screen) => screen.classList.remove("active"));
  document.querySelector(`#screen-${project.section}`).classList.add("active");
  renderCoverScreen(project);
  renderScoreScreen(project);
  renderActionsScreen(project);
  renderEvidenceScreen(project);
  renderReportScreen(project);
}

function renderNav(project) {
  const syncLabel = state.isSaving
    ? "正在保存到后端"
    : state.error
      ? `保存失败：${state.error}`
      : state.lastSavedAt
        ? `已保存 ${state.lastSavedAt.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`
        : "后端已连接";
  document.querySelector("#navSteps").innerHTML = `
    ${sections.map(([id, title, subtitle]) => `
      <button class="nav-btn ${project.section === id ? "active" : ""}" data-section="${id}" type="button">
        <strong>${title}</strong><span>${subtitle}</span>
      </button>`).join("")}
    <div class="empty">${esc(syncLabel)}</div>`;
}

function renderCover(project) {
  const currentScore = score(project);
  const [label, color] = status(currentScore.percent, currentScore.answered);
  document.querySelector("#coverTitle").textContent = `${project.client.name || "未命名小程序"} Agent-ready 改造交付包`;
  document.querySelector("#coverIndustry").textContent = project.client.industry || "行业未填写";
  document.querySelector("#coverGoal").textContent = project.client.goal || "目标未填写";
  document.querySelector("#coverDate").textContent = new Date(project.updatedAt).toLocaleDateString("zh-CN");
  document.querySelector("#scoreValue").textContent = currentScore.percent;
  document.querySelector("#scoreLabel").textContent = label;
  document.querySelector("#scoreLabel").style.background = color;
  document.querySelector("#scoreFill").style.width = `${currentScore.percent}%`;
}

function renderCoverScreen(project) {
  const currentScore = score(project);
  document.querySelector("#screen-cover").innerHTML = `
    <div class="grid">
      <div class="panel">
        <div class="panel-head"><div><h3>交付摘要</h3><p class="sub">这部分决定客户看到的封面和结论上下文。</p></div></div>
        <div class="content form-grid">
          ${input("客户 / 小程序名称", "client.name", project.client.name, "例如：某口腔预约小程序")}
          ${input("行业", "client.industry", project.client.industry, "例如：口腔预约")}
          ${input("业务目标", "client.goal", project.client.goal, "例如：提升洗牙预约转化")}
          ${input("交付负责人", "client.owner", project.client.owner, "你的名字或团队")}
          ${textarea("执行摘要", "client.summary", project.client.summary, "一句话结论：当前最影响 Agent 成交的是哪里。", true)}
          ${textarea("当前用户路径", "client.currentPath", project.client.currentPath, "用户现在如何完成下单/预约。", true)}
          ${textarea("业务价值", "client.businessValue", project.client.businessValue, "客单价、线索价值、转化提升空间。", true)}
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><div><h3>交付状态</h3><p class="sub">用于判断现在能不能交付客户。</p></div></div>
        <div class="content">
          <div class="mini-stats">
            <div class="stat"><strong>${currentScore.answered}/9</strong><span>已完成评分</span></div>
            <div class="stat"><strong>${currentScore.missing}</strong><span>缺证据项</span></div>
            <div class="stat"><strong>${topRisks(project).length}</strong><span>风险项</span></div>
            <div class="stat"><strong>${filledEvidenceCount(project)}</strong><span>证据记录</span></div>
          </div>
        </div>
      </div>
    </div>`;
  bindInputs(project);
}

function renderScoreScreen(project) {
  document.querySelector("#screen-score").innerHTML = `
    <div class="grid">
      <div class="panel">
        <div class="panel-head"><div><h3>Agent-ready 评分</h3><p class="sub">每一项都要能落到证据和行动。</p></div></div>
        <div class="content card-list">${checks.map((check) => scoreCard(project, check)).join("")}</div>
      </div>
      <div class="panel">
        <div class="panel-head"><div><h3>真实工具接口</h3><p class="sub">这里只展示可接入能力，未接入上游就不产出结果。</p></div></div>
        <div class="content executive-list">
          ${integrations.map((item) => `
            <div class="exec-item ${item.configured ? "" : "p0"}">
              <strong>${item.name}</strong>
              <p>${item.configured ? "已配置凭证，可接真实上游适配器。" : `未配置：${item.missingEnv.join(", ")}`}</p>
            </div>`).join("")}
        </div>
      </div>
    </div>`;
  bindScore(project);
}

function renderActionsScreen(project) {
  const risks = topRisks(project);
  document.querySelector("#screen-actions").innerHTML = `
    <div class="grid">
      <div class="panel">
        <div class="panel-head"><div><h3>优先行动清单</h3><p class="sub">报告里的主交付内容。</p></div></div>
        <div class="content executive-list">${risks.length ? risks.map(({ check, answer }) => `
          <div class="exec-item ${answer.priority === "P0" ? "p0" : ""}">
            <strong>${answer.priority} · ${check.name}</strong>
            <p>${esc(answer.risk || answer.action || check.recommendation)}</p>
          </div>`).join("") : `<div class="empty">完成评分后自动生成。</div>`}</div>
      </div>
      <div class="panel">
        <div class="panel-head"><div><h3>下一步包装</h3><p class="sub">让交付结果直接接到改造项目。</p></div></div>
        <div class="content executive-list">
          <div class="exec-item"><strong>第一优先级</strong><p>选择一个能直接影响成交的流程，例如预约、下单、支付确认。</p></div>
          <div class="exec-item"><strong>第二优先级</strong><p>补齐该流程需要的商品/服务 schema、实时状态和确认页。</p></div>
          <div class="exec-item"><strong>第三优先级</strong><p>设计异常恢复和人工兜底，避免 Agent 卡死。</p></div>
        </div>
      </div>
    </div>`;
}

function renderEvidenceScreen(project) {
  document.querySelector("#screen-evidence").innerHTML = `
    <div class="panel">
      <div class="panel-head"><div><h3>支撑证据</h3><p class="sub">这部分是附录，不抢报告主线。</p></div></div>
      <div class="content card-list">
        ${evidenceTable(project, "pages", "页面证据", [["name", "页面"], ["path", "路径"], ["finding", "发现"], ["impact", "影响"]])}
        ${evidenceTable(project, "flows", "流程证据", [["name", "流程"], ["steps", "当前步骤"], ["friction", "摩擦"], ["target", "目标状态"]])}
        ${evidenceTable(project, "data", "数据证据", [["entity", "对象"], ["fields", "字段"], ["source", "来源"], ["gap", "缺口"]])}
        ${evidenceTable(project, "permissions", "权限证据", [["action", "动作"], ["data", "数据"], ["confirm", "确认"], ["risk", "风险"]])}
      </div>
    </div>`;
  bindEvidence(project);
}

function renderReportScreen(project) {
  document.querySelector("#screen-report").innerHTML = `
    <div class="grid">
      <div class="panel">
        <div class="panel-head">
          <div><h3>交付报告</h3><p class="sub">报告由后端根据已持久化项目生成。</p></div>
          <div>
            <button class="btn" id="exportJson" type="button">导出 JSON</button>
            <button class="btn primary" id="exportMd" type="button">导出 Markdown</button>
          </div>
        </div>
        <div class="content"><pre class="report">${esc(state.reportText || "正在从后端生成报告...")}</pre></div>
      </div>
      <div class="panel">
        <div class="panel-head"><div><h3>交付检查</h3><p class="sub">交付前看这四项。</p></div></div>
        <div class="content executive-list">
          ${deliveryChecklist(project).map((item) => `<div class="exec-item"><strong>${item[0]}</strong><p>${item[1]}</p></div>`).join("")}
        </div>
      </div>
    </div>`;
  document.querySelector("#exportJson").addEventListener("click", async () => {
    await flushSave({ refresh: true });
    const latest = await api(`/api/projects/${encodeURIComponent(project.id)}`);
    download(`${fileName(latest.project)}.agent-ready.json`, JSON.stringify(latest.project, null, 2), "application/json;charset=utf-8");
  });
  document.querySelector("#exportMd").addEventListener("click", async () => {
    await flushSave({ refresh: true });
    const report = await api(`/api/projects/${encodeURIComponent(project.id)}/report`, {
      headers: { accept: "text/markdown" }
    });
    download(`${fileName(project)}-Agent-ready交付报告.md`, report);
  });
}

function input(label, path, value, placeholder) {
  return `<label>${label}<input data-path="${path}" value="${esc(value)}" placeholder="${esc(placeholder)}" /></label>`;
}

function textarea(label, path, value, placeholder, wide = false) {
  return `<label class="${wide ? "wide" : ""}">${label}<textarea data-path="${path}" placeholder="${esc(placeholder)}">${esc(value)}</textarea></label>`;
}

function bindInputs(project) {
  document.querySelectorAll("[data-path]").forEach((field) => {
    field.addEventListener("input", () => {
      const [group, key] = field.dataset.path.split(".");
      project[group][key] = field.value;
      scheduleSave();
      renderCover(project);
    });
  });
}

function scoreCard(project, check) {
  const answer = project.answers[check.id];
  return `<div class="question">
    <div class="question-top">
      <div>
        <div class="question-title">${check.name}</div>
        <div class="question-desc">${check.desc}</div>
      </div>
      <label>分数<select data-score="${check.id}">
        <option value="">未评</option>
        ${[0, 1, 2, 3, 4, 5].map((value) => `<option value="${value}" ${String(answer.score) === String(value) ? "selected" : ""}>${value}/5</option>`).join("")}
      </select></label>
    </div>
    <div class="subgrid">
      <label>证据<textarea data-answer="${check.id}" data-key="evidence" placeholder="页面、接口、截图、访谈记录">${esc(answer.evidence)}</textarea></label>
      <label>风险<textarea data-answer="${check.id}" data-key="risk" placeholder="对成交/调用的影响">${esc(answer.risk)}</textarea></label>
      <label>优先级<select data-answer="${check.id}" data-key="priority">${["P0", "P1", "P2"].map((priority) => `<option ${answer.priority === priority ? "selected" : ""}>${priority}</option>`).join("")}</select></label>
      <label>行动<input data-answer="${check.id}" data-key="action" value="${esc(answer.action)}" placeholder="${esc(check.recommendation)}" /></label>
    </div>
  </div>`;
}

function bindScore(project) {
  document.querySelectorAll("[data-score]").forEach((field) => {
    field.addEventListener("change", () => {
      project.answers[field.dataset.score].score = field.value;
      delete project.computed;
      scheduleSave({ refresh: true, rerender: true });
      render();
    });
  });
  document.querySelectorAll("[data-answer]").forEach((field) => {
    const eventName = field.tagName === "SELECT" ? "change" : "input";
    field.addEventListener(eventName, () => {
      project.answers[field.dataset.answer][field.dataset.key] = field.value;
      delete project.computed;
      scheduleSave({ refresh: true });
    });
  });
}

function evidenceTable(project, key, title, columns) {
  const rows = project.evidence[key];
  return `<div class="panel">
    <div class="panel-head"><div><h3>${title}</h3></div><button class="btn small primary" data-add="${key}" type="button">新增</button></div>
    <div class="content table-wrap">${rows.length ? `<table><thead><tr>${columns.map(([, label]) => `<th>${label}</th>`).join("")}<th>操作</th></tr></thead><tbody>${rows.map((row, index) => `<tr>${columns.map(([field]) => `<td><textarea data-row="${key}" data-index="${index}" data-key="${field}">${esc(row[field] || "")}</textarea></td>`).join("")}<td><button class="btn small danger" data-delete="${key}" data-index="${index}" type="button">删除</button></td></tr>`).join("")}</tbody></table>` : `<div class="empty">暂无记录。</div>`}</div>
  </div>`;
}

function bindEvidence(project) {
  document.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => {
      const templates = {
        pages: { name: "", path: "", finding: "", impact: "" },
        flows: { name: "", steps: "", friction: "", target: "" },
        data: { entity: "", fields: "", source: "", gap: "" },
        permissions: { action: "", data: "", confirm: "", risk: "" }
      };
      project.evidence[button.dataset.add].push({ id: crypto.randomUUID(), ...templates[button.dataset.add] });
      scheduleSave({ refresh: true });
      renderEvidenceScreen(project);
    });
  });
  document.querySelectorAll("[data-row]").forEach((field) => {
    field.addEventListener("input", () => {
      project.evidence[field.dataset.row][Number(field.dataset.index)][field.dataset.key] = field.value;
      scheduleSave({ refresh: true });
    });
  });
  document.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      project.evidence[button.dataset.delete].splice(Number(button.dataset.index), 1);
      scheduleSave({ refresh: true });
      renderEvidenceScreen(project);
    });
  });
}

function topRisks(project) {
  return checks
    .map((check) => ({ check, answer: project.answers[check.id] }))
    .filter(({ answer }) => {
      const hasScore = answer.score !== "";
      return answer.priority === "P0" || answer.priority === "P1" || (hasScore && Number(answer.score) <= 2) || (hasScore && !String(answer.evidence || "").trim());
    })
    .slice(0, 8);
}

function filledEvidenceCount(project) {
  return Object.values(project.evidence).reduce((sum, rows) => sum + rows.length, 0);
}

function deliveryChecklist(project) {
  const currentScore = score(project);
  return [
    ["评分完整度", `${currentScore.answered}/9 项已评分。`],
    ["证据完整度", `${currentScore.missing} 个评分项缺证据。`],
    ["行动清单", `${topRisks(project).length} 个风险/行动项。`],
    ["支撑材料", `${filledEvidenceCount(project)} 条附录证据。`]
  ];
}

function download(filename, content, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function fileName(project) {
  return (project.client.name || "agent-ready-delivery").replace(/[\\/:*?"<>|\s]+/g, "-").slice(0, 60);
}

document.querySelector("#navSteps").addEventListener("click", async (event) => {
  const button = event.target.closest("[data-section]");
  if (!button) return;
  const project = active();
  if (!project) return;
  project.section = button.dataset.section;
  scheduleSave({ refresh: project.section === "report", rerender: true });
  if (project.section === "report") await flushSave({ refresh: true, rerender: false });
  render();
});

document.querySelector("#newBtn").addEventListener("click", async () => {
  const created = await api("/api/projects", {
    method: "POST",
    body: JSON.stringify({ project: {} })
  });
  state.projects.unshift(created.project);
  state.activeId = created.project.id;
  state.reportText = "";
  render();
  await refreshReport();
});

document.querySelector("#importBtn").addEventListener("click", () => document.querySelector("#importFile").click());
document.querySelector("#importFile").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const imported = await api("/api/import", {
      method: "POST",
      body: JSON.stringify({ project: JSON.parse(await file.text()) })
    });
    state.projects.unshift(imported.project);
    state.activeId = imported.project.id;
    state.reportText = "";
    render();
    await refreshReport();
  } catch (error) {
    alert(`导入失败：${error.message}`);
  } finally {
    event.target.value = "";
  }
});

boot();
