const sections = [
  ["projects", "Projects", "folder", "项目首页"],
  ["cover", "Project File", "info", "档案详情"],
  ["diagnostic", "Diagnostic", "analytics", "诊断评分"],
  ["actions", "Transformation", "auto_fix_high", "行动清单"],
  ["evidence", "Evidence", "menu_book", "证据附录"],
  ["reports", "Reports", "description", "报告导出"]
];

let checks = [];
let integrations = [];
let saveTimer = null;

const state = {
  view: "projects",
  activeId: null,
  projects: [],
  reportText: "",
  isSaving: false,
  lastSavedAt: null,
  error: "",
  search: "",
  exportFormat: "markdown"
};

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  const contentType = response.headers.get("content-type") || "";
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
  } catch (error) {
    state.error = error.message;
    document.querySelector("#main").innerHTML = `
      <section class="empty">
        <h2>服务未就绪</h2>
        <p>${esc(error.message)}</p>
      </section>`;
  }
}

function active() {
  return state.projects.find((project) => project.id === state.activeId) || state.projects[0] || null;
}

function replaceProject(project) {
  const index = state.projects.findIndex((item) => item.id === project.id);
  if (index === -1) state.projects.unshift(project);
  else state.projects[index] = project;
  state.activeId = project.id;
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

function statusLabel(currentScore) {
  if (!currentScore.answered) return ["待评估", "neutral"];
  if (currentScore.percent < 35) return ["基础未就绪", "error"];
  if (currentScore.percent < 60) return ["重点流程改造", "amber"];
  if (currentScore.percent < 82) return ["可进入试点", "primary"];
  return ["高度就绪", "secondary"];
}

function grade(percent, answered) {
  if (!answered) return "NA";
  if (percent >= 82) return "A";
  if (percent >= 70) return "B";
  if (percent >= 60) return "C+";
  if (percent >= 45) return "C";
  return "D";
}

function topRisks(project) {
  return checks
    .map((check) => ({ check, answer: project.answers?.[check.id] || {} }))
    .filter(({ answer }) => {
      const hasScore = answer.score !== "";
      return answer.priority === "P0" || answer.priority === "P1" || (hasScore && Number(answer.score) <= 2) || (hasScore && !String(answer.evidence || "").trim());
    })
    .slice(0, 10);
}

function filledEvidenceCount(project) {
  if (!project?.evidence) return 0;
  return Object.values(project.evidence).reduce((sum, rows) => sum + (Array.isArray(rows) ? rows.length : 0), 0);
}

function filteredProjects() {
  const q = state.search.trim().toLowerCase();
  if (!q) return state.projects;
  return state.projects.filter((project) => {
    const fields = [project.client?.name, project.client?.industry, project.client?.goal, project.client?.owner];
    return fields.some((value) => String(value || "").toLowerCase().includes(q));
  });
}

function render() {
  renderTopLinks();
  renderLeftNav();
  const renderer = {
    projects: renderProjects,
    cover: renderCover,
    diagnostic: renderDiagnostic,
    actions: renderActions,
    evidence: renderEvidence,
    reports: renderReports
  }[state.view] || renderProjects;
  renderer();
  renderContext();
}

function renderTopLinks() {
  const topLinks = document.querySelector("#topLinks");
  topLinks.innerHTML = ["Dashboard", "Inventory", "Archive", "Settings"].map((item, index) => `
    <button class="${index === 0 ? "active" : ""}" type="button">${item}</button>
  `).join("");
}

function renderLeftNav() {
  const nav = document.querySelector("#leftNav");
  nav.innerHTML = sections.map(([id, label, icon]) => `
    <button class="nav-item ${state.view === id ? "active" : ""}" data-view="${id}" type="button">
      <span class="material-symbols-outlined">${icon}</span>${label}
    </button>
  `).join("");
  nav.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", async () => {
      await flushSave({ refreshReport: state.view === "reports" });
      state.view = button.dataset.view;
      if (state.view === "reports") await refreshReport();
      render();
    });
  });
}

function renderProjects() {
  const main = document.querySelector("#main");
  const projects = filteredProjects();
  const pending = state.projects.filter((project) => score(project).answered === 0).length;
  const action = state.projects.filter((project) => topRisks(project).length > 0).length;
  const done = state.projects.filter((project) => score(project).percent >= 82).length;
  main.innerHTML = `
    <div class="page-head">
      <div>
        <h2>Active Projects</h2>
        <p>Overview of transformation pipelines.</p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="secondary-btn" id="importBtn" type="button"><span class="material-symbols-outlined">upload_file</span>Import JSON</button>
        <button class="primary-btn" id="newProjectBtn" type="button"><span class="material-symbols-outlined">add</span>New Project</button>
      </div>
    </div>
    <div class="grid-12">
      <section class="span-8">
        <div class="grid-12">${projects.length ? projects.map(projectCard).join("") : `<div class="span-12 empty">没有匹配项目。</div>`}</div>
      </section>
      <aside class="span-4" style="display:grid;gap:24px;align-content:start;">
        <div class="liquid-glass panel">
          <h3>Pipeline Summary</h3>
          <div class="mini-grid" style="margin-top:16px;">
            <div class="stat-box"><strong>${pending}</strong><span>PENDING</span></div>
            <div class="stat-box" style="background:rgba(134,242,228,.22);"><strong style="color:var(--secondary);">${action}</strong><span>ACTION</span></div>
            <div class="stat-box"><strong>${done}</strong><span>READY</span></div>
          </div>
        </div>
        <div class="liquid-glass panel">
          <h3>Recent Activity</h3>
          <div style="display:grid;gap:16px;margin-top:16px;">
            ${state.projects.slice(0, 4).map(activityItem).join("") || `<div class="empty">暂无活动。</div>`}
          </div>
        </div>
      </aside>
    </div>`;
  main.querySelectorAll("[data-open-project]").forEach((card) => {
    card.addEventListener("click", () => {
      state.activeId = card.dataset.openProject;
      state.view = "cover";
      render();
    });
  });
  main.querySelector("#newProjectBtn").addEventListener("click", createProject);
  main.querySelector("#importBtn").addEventListener("click", () => document.querySelector("#importFile").click());
}

function projectCard(project) {
  const currentScore = score(project);
  const [label, tone] = statusLabel(currentScore);
  const title = project.client?.name || "未命名小程序";
  const industry = project.client?.industry || "行业未填写";
  const owner = project.client?.owner || "FDE";
  return `
    <article class="span-6 liquid-glass panel project-card" data-open-project="${esc(project.id)}">
      <div class="card-top">
        <div class="card-title-row">
          <div class="tile-icon"><span class="material-symbols-outlined">storefront</span></div>
          <div>
            <h3>${esc(title)}</h3>
            <p class="eyebrow" style="margin-top:4px;">${esc(industry)} · ${currentScore.answered ? "Agent Ready" : "New Intake"}</p>
          </div>
        </div>
        <span class="badge ${tone}">${label}</span>
      </div>
      <div class="progress-wrap">
        <div class="progress-meta">
          <span class="subtle">Transformation Score</span>
          <strong style="color:${tone === "secondary" ? "var(--secondary)" : "var(--primary)"};">${currentScore.percent}/100</strong>
        </div>
        <div class="progress"><i style="--value:${currentScore.percent}%;--bar:${tone === "secondary" ? "var(--secondary)" : "var(--primary)"};"></i></div>
      </div>
      <div style="margin-top:auto;display:flex;align-items:center;justify-content:space-between;padding-top:8px;border-top:1px solid rgba(195,198,215,.34);">
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="tile-icon" style="width:24px;height:24px;border-radius:999px;font-size:10px;color:var(--on-tertiary-container);background:var(--tertiary-container);">${esc(initials(owner))}</div>
          <span class="subtle">Updated ${relativeTime(project.updatedAt)}</span>
        </div>
        <span class="material-symbols-outlined" style="color:var(--outline);">arrow_forward</span>
      </div>
    </article>`;
}

function activityItem(project) {
  const currentScore = score(project);
  return `
    <div style="display:flex;gap:12px;align-items:start;">
      <div class="tile-icon" style="width:24px;height:24px;border-radius:999px;color:${currentScore.answered ? "var(--on-secondary)" : "var(--on-primary)"};background:${currentScore.answered ? "var(--secondary)" : "var(--primary)"};">
        <span class="material-symbols-outlined" style="font-size:14px;">${currentScore.answered ? "check" : "sync"}</span>
      </div>
      <div>
        <strong style="display:block;font-size:14px;">${currentScore.answered ? "Health Score Generated" : "Project Created"}</strong>
        <span class="subtle">${esc(project.client?.name || "未命名小程序")} · ${relativeTime(project.updatedAt)}</span>
      </div>
    </div>`;
}

function renderCover() {
  const project = active();
  const main = document.querySelector("#main");
  const currentScore = score(project);
  const [label, tone] = statusLabel(currentScore);
  main.innerHTML = `
    <div class="page-head">
      <div>
        <p class="eyebrow">Project File</p>
        <h2>${esc(project.client.name || "未命名小程序")}</h2>
        <p>客户档案、交付边界和当前路径会真实保存到后端。</p>
      </div>
      <button class="primary-btn" id="goScore" type="button"><span class="material-symbols-outlined">analytics</span>Start Diagnostic</button>
    </div>
    <div class="grid-12">
      <section class="span-8 liquid-glass panel">
        <div class="panel-head">
          <div>
            <h3>交付封面 / 项目档案</h3>
            <p class="subtle">这部分决定客户看到的封面和结论上下文。</p>
          </div>
          <span class="badge ${tone}">${label}</span>
        </div>
        <div class="form-grid">
          ${input("客户 / 小程序名称", "client.name", project.client.name, "例如：烟测医美预约小程序")}
          ${input("行业", "client.industry", project.client.industry, "例如：口腔预约")}
          ${input("业务目标", "client.goal", project.client.goal, "例如：提升预约转化")}
          ${input("交付负责人", "client.owner", project.client.owner, "你的名字或团队")}
          ${textarea("执行摘要", "client.summary", project.client.summary, "一句话结论：当前最影响 Agent 成交的是哪里。", true)}
          ${textarea("当前用户路径", "client.currentPath", project.client.currentPath, "用户现在如何完成下单/预约。", true)}
          ${textarea("业务价值", "client.businessValue", project.client.businessValue, "客单价、线索价值、转化提升空间。", true)}
        </div>
      </section>
      <aside class="span-4" style="display:grid;gap:24px;align-content:start;">
        <div class="liquid-glass panel">
          <h3>Project Health</h3>
          <div style="display:flex;align-items:baseline;gap:8px;margin-top:12px;">
            <strong style="font-size:48px;line-height:1.2;color:var(--primary);">${currentScore.percent}</strong>
            <span class="subtle">/ 100</span>
          </div>
          <div class="progress" style="margin-top:10px;"><i style="--value:${currentScore.percent}%;"></i></div>
        </div>
        <div class="liquid-glass panel">
          <h3>交付状态</h3>
          <div class="mini-grid" style="margin-top:16px;">
            <div class="stat-box"><strong>${currentScore.answered}/9</strong><span>SCORED</span></div>
            <div class="stat-box"><strong>${currentScore.missing}</strong><span>MISSING</span></div>
            <div class="stat-box"><strong>${topRisks(project).length}</strong><span>RISKS</span></div>
          </div>
        </div>
      </aside>
    </div>`;
  bindDataFields(project);
  main.querySelector("#goScore").addEventListener("click", () => {
    state.view = "diagnostic";
    render();
  });
}

function renderDiagnostic() {
  const project = active();
  const main = document.querySelector("#main");
  const currentScore = score(project);
  main.innerHTML = `
    <div class="page-head">
      <div>
        <h2>Diagnostic Workflow</h2>
        <p>Evaluate mini-program compatibility across key dimensions.</p>
      </div>
      <button class="secondary-btn" id="refreshSchema" type="button"><span class="material-symbols-outlined">sync</span>Refresh Schema</button>
    </div>
    <section style="display:grid;gap:8px;padding-bottom:120px;">
      ${checks.map((check) => diagnosticRow(project, check)).join("")}
    </section>
    ${floatingScore(currentScore)}`;
  bindScoreFields(project);
  main.querySelector("#refreshSchema").addEventListener("click", async () => {
    const schema = await api("/api/schema");
    checks = schema.checks || [];
    integrations = schema.integrations || [];
    toast("Schema refreshed", "评分维度与真实工具状态已从后端刷新。");
    render();
  });
}

function diagnosticRow(project, check) {
  const answer = project.answers?.[check.id] || {};
  const value = answer.score === "" ? 0 : Number(answer.score);
  const riskTone = answer.priority === "P0" || value <= 2 ? "error" : answer.priority === "P1" || value <= 3 ? "amber" : "secondary";
  const riskLabel = riskTone === "error" ? "High Risk" : riskTone === "amber" ? "Medium Risk" : "Low Risk";
  return `
    <article class="glass-panel score-row ${riskTone === "error" ? "risk-high" : ""}" data-check="${esc(check.id)}">
      <div class="score-line">
        <div class="score-title">
          <h4>${esc(check.name)} ${riskTone === "error" ? `<span class="material-symbols-outlined" style="font-size:16px;color:var(--error);">warning</span>` : ""}</h4>
          <p class="subtle">${esc(check.desc)}</p>
        </div>
        <div class="range-box">
          <input data-score="${esc(check.id)}" type="range" min="0" max="5" value="${value}" />
          <span class="score-num">${answer.score === "" ? "未评" : `${value}`}</span>
        </div>
        <div class="row-actions">
          <span class="badge ${riskTone}"><span class="material-symbols-outlined" style="font-size:14px;">${riskTone === "error" ? "report" : "check_circle"}</span>${riskLabel}</span>
          <select data-answer="${esc(check.id)}" data-key="priority" style="width:82px;">
            ${["P0", "P1", "P2"].map((priority) => `<option value="${priority}" ${answer.priority === priority ? "selected" : ""}>${priority}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="evidence-area">
        <label>证据<textarea data-answer="${esc(check.id)}" data-key="evidence" placeholder="页面、接口、截图、访谈记录">${esc(answer.evidence)}</textarea></label>
        <label>风险<textarea data-answer="${esc(check.id)}" data-key="risk" placeholder="对成交/调用的影响">${esc(answer.risk)}</textarea></label>
        <label class="wide">行动建议<input data-answer="${esc(check.id)}" data-key="action" value="${esc(answer.action)}" placeholder="${esc(check.recommendation)}" /></label>
      </div>
    </article>`;
}

function renderActions() {
  const project = active();
  const main = document.querySelector("#main");
  const risks = topRisks(project);
  main.innerHTML = `
    <div class="page-head">
      <div>
        <h2>Action List</h2>
        <p>把诊断结论转成可执行改造任务，任务来自已持久化评分项。</p>
      </div>
      <button class="secondary-btn" type="button" id="goDiagnostic"><span class="material-symbols-outlined">analytics</span>Edit Scores</button>
    </div>
    <section class="glass-panel table-panel">
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Acceptance</th>
            </tr>
          </thead>
          <tbody>
            ${risks.length ? risks.map(({ check, answer }) => actionRow(project, check, answer)).join("") : `<tr><td colspan="5"><div class="empty">完成评分后自动生成行动清单。</div></td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
    ${floatingScore(score(project))}`;
  bindActionFields(project);
  main.querySelector("#goDiagnostic").addEventListener("click", () => {
    state.view = "diagnostic";
    render();
  });
}

function actionRow(project, check, answer) {
  const priority = answer.priority || "P2";
  const priorityTone = priority === "P0" ? "error" : priority === "P1" ? "amber" : "neutral";
  return `
    <tr data-action-row="${esc(check.id)}">
      <td>
        <strong style="display:block;color:var(--on-surface);">${esc(answer.action || check.recommendation)}</strong>
        <span class="subtle">${esc(check.name)} · ${esc(answer.risk || "待补充风险说明")}</span>
      </td>
      <td>
        <select data-answer="${esc(check.id)}" data-key="priority" style="width:92px;">
          ${["P0", "P1", "P2"].map((item) => `<option value="${item}" ${priority === item ? "selected" : ""}>${item}</option>`).join("")}
        </select>
        <div style="margin-top:6px;"><span class="badge ${priorityTone}">${priority === "P0" ? "High" : priority === "P1" ? "Med" : "Low"}</span></div>
      </td>
      <td><span class="badge primary">In Review</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="tile-icon" style="width:24px;height:24px;border-radius:999px;font-size:10px;">${esc(initials(project.client?.owner || "FDE"))}</div>
          <span class="subtle">${esc(project.client?.owner || "Agent-ready FDE")}</span>
        </div>
      </td>
      <td><input data-answer="${esc(check.id)}" data-key="action" value="${esc(answer.action || check.recommendation)}" /></td>
    </tr>`;
}

function renderEvidence() {
  const project = active();
  const main = document.querySelector("#main");
  main.innerHTML = `
    <div class="page-head">
      <div>
        <h2>Evidence Appendix</h2>
        <p>页面、流程、数据、权限证据都会保存到项目文件。</p>
      </div>
    </div>
    <div class="grid-12">
      <section class="span-4" style="display:grid;gap:16px;align-content:start;">
        ${evidenceGallery(project)}
      </section>
      <section class="span-8" style="display:grid;gap:16px;">
        ${evidenceEditor(project, "pages", "页面证据", [["name", "页面"], ["path", "路径"], ["finding", "发现"], ["impact", "影响"]])}
        ${evidenceEditor(project, "flows", "流程证据", [["name", "流程"], ["steps", "当前步骤"], ["friction", "摩擦"], ["target", "目标状态"]])}
        ${evidenceEditor(project, "data", "数据证据", [["entity", "对象"], ["fields", "字段"], ["source", "来源"], ["gap", "缺口"]])}
        ${evidenceEditor(project, "permissions", "权限证据", [["action", "动作"], ["data", "数据"], ["confirm", "确认"], ["risk", "风险"]])}
      </section>
    </div>`;
  bindEvidence(project);
}

function evidenceGallery(project) {
  const rows = [
    ...(project.evidence?.pages || []).map((row) => ({ type: "页面", title: row.name, desc: row.finding, code: row.path, icon: "image" })),
    ...(project.evidence?.flows || []).map((row) => ({ type: "流程", title: row.name, desc: row.friction, code: row.steps, icon: "account_tree" })),
    ...(project.evidence?.data || []).map((row) => ({ type: "数据", title: row.entity, desc: row.gap, code: row.source, icon: "data_object" })),
    ...(project.evidence?.permissions || []).map((row) => ({ type: "权限", title: row.action, desc: row.risk, code: row.data, icon: "verified_user" }))
  ];
  return `
    <div>
      <h3 style="font-size:20px;line-height:1.4;margin-bottom:12px;">Evidence Gallery</h3>
      <div style="display:grid;gap:16px;">
        ${rows.length ? rows.slice(0, 6).map((row, index) => `
          <article class="glass-panel evidence-card">
            <div class="evidence-thumb"><span class="material-symbols-outlined" style="font-size:36px;">${row.icon}</span></div>
            <div>
              <h4 style="font-size:12px;line-height:1;font-weight:800;letter-spacing:.05em;">${esc(row.title || `${row.type}证据 ${index + 1}`)}</h4>
              <p class="subtle" style="margin-top:4px;">${esc(row.desc || "未填写说明")}</p>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(195,198,215,.3);padding-top:8px;">
              <code style="font-size:13px;color:var(--tertiary);">${esc(row.code || row.type)}</code>
              <span class="badge neutral">${row.type}</span>
            </div>
          </article>`).join("") : `<div class="empty">暂无证据。右侧新增后会出现在这里。</div>`}
      </div>
    </div>`;
}

function evidenceEditor(project, key, title, columns) {
  const rows = project.evidence?.[key] || [];
  return `
    <section class="glass-panel table-panel">
      <div class="panel-head" style="padding:16px;margin:0;border-bottom:1px solid rgba(255,255,255,.5);">
        <div><h3>${title}</h3><p class="subtle">${rows.length} records</p></div>
        <button class="primary-btn" data-add-evidence="${key}" type="button"><span class="material-symbols-outlined">add</span>Add</button>
      </div>
      <div class="table-scroll">
        ${rows.length ? `<table>
          <thead><tr>${columns.map(([, label]) => `<th>${label}</th>`).join("")}<th>操作</th></tr></thead>
          <tbody>${rows.map((row, index) => `
            <tr>
              ${columns.map(([field]) => `<td><textarea data-evidence="${key}" data-index="${index}" data-field="${field}">${esc(row[field] || "")}</textarea></td>`).join("")}
              <td><button class="danger-btn" data-delete-evidence="${key}" data-index="${index}" type="button"><span class="material-symbols-outlined">delete</span>Delete</button></td>
            </tr>`).join("")}</tbody>
        </table>` : `<div class="empty" style="margin:16px;">暂无记录。</div>`}
      </div>
    </section>`;
}

async function renderReports() {
  const project = active();
  if (!state.reportText) await refreshReport();
  const main = document.querySelector("#main");
  main.innerHTML = `
    <div class="page-head">
      <div>
        <h2>Evidence & Report Export</h2>
        <p>报告内容由后端根据已持久化项目生成。</p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="secondary-btn" id="exportJson" type="button"><span class="material-symbols-outlined">data_object</span>Export JSON</button>
        <button class="primary-btn" id="exportReport" type="button"><span class="material-symbols-outlined">ios_share</span>Export Report</button>
      </div>
    </div>
    <div class="grid-12">
      <section class="span-8">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <h3 style="font-size:20px;line-height:1.4;">Report Preview</h3>
          <div class="glass-panel" style="display:flex;border-radius:8px;padding:4px;">
            <button class="ghost-btn" type="button" style="border:0;background:var(--surface);color:var(--on-surface);">Summary</button>
            <button class="ghost-btn" type="button" style="border:0;">Details</button>
            <button class="ghost-btn" type="button" style="border:0;">Appendix</button>
          </div>
        </div>
        <pre class="report-paper">${esc(state.reportText || "正在从后端生成报告...")}</pre>
      </section>
      <aside class="span-4 liquid-glass panel" style="align-self:start;">
        <h3>Export Configuration</h3>
        <div style="display:grid;gap:18px;margin-top:18px;">
          <label>Report Type
            <select id="reportType">
              <option>Delivery Handover</option>
              <option>Audit Report</option>
              <option>Executive Summary</option>
            </select>
          </label>
          <label>Format
            <select id="formatSelect">
              <option value="markdown" ${state.exportFormat === "markdown" ? "selected" : ""}>Markdown</option>
              <option value="json" ${state.exportFormat === "json" ? "selected" : ""}>JSON</option>
              <option value="pdf" ${state.exportFormat === "pdf" ? "selected" : ""}>PDF（未配置）</option>
            </select>
          </label>
          <div class="glass-panel sm" style="border-radius:8px;">
            <strong style="display:block;font-size:12px;letter-spacing:.05em;">真实导出状态</strong>
            <p class="subtle" style="margin-top:8px;">Markdown 和 JSON 已接后端。PDF 渲染器尚未配置，选择 PDF 会明确返回未配置提示，不生成模拟文件。</p>
          </div>
          <div style="display:grid;gap:8px;">
            <label style="display:flex;justify-content:space-between;align-items:center;grid-template-columns:1fr auto;">
              Evidence Appendix <input checked type="checkbox" style="width:auto;" />
            </label>
            <label style="display:flex;justify-content:space-between;align-items:center;grid-template-columns:1fr auto;">
              Transformation Timeline <input checked type="checkbox" style="width:auto;" />
            </label>
            <label style="display:flex;justify-content:space-between;align-items:center;grid-template-columns:1fr auto;">
              Raw Diagnostic Logs <input type="checkbox" style="width:auto;" />
            </label>
          </div>
        </div>
      </aside>
    </div>`;
  main.querySelector("#formatSelect").addEventListener("change", (event) => {
    state.exportFormat = event.target.value;
  });
  main.querySelector("#exportJson").addEventListener("click", exportJson);
  main.querySelector("#exportReport").addEventListener("click", exportReport);
}

function renderContext() {
  const project = active();
  const panel = document.querySelector("#contextPanel");
  if (!project) {
    panel.innerHTML = `<div class="empty">没有项目。</div>`;
    return;
  }
  const currentScore = score(project);
  const risks = topRisks(project);
  panel.innerHTML = `
    <div>
      <h2 class="eyebrow" style="color:var(--secondary);">Context Panel</h2>
      <p class="subtle" style="margin-top:6px;">${esc(project.client?.name || "Active Transformation")}</p>
    </div>
    <nav class="context-nav">
      ${sections.filter(([id]) => id !== "projects").map(([id, label, icon]) => `
        <button class="context-link ${state.view === id ? "active" : ""}" data-context-view="${id}" type="button">
          <span class="material-symbols-outlined">${icon}</span>${label}
        </button>`).join("")}
    </nav>
    <div class="glass-panel panel sm">
      <h3 style="font-size:12px;line-height:1;letter-spacing:.05em;text-transform:uppercase;">Health Score</h3>
      <div style="display:flex;align-items:baseline;gap:8px;margin-top:10px;">
        <strong style="font-size:40px;line-height:1.2;color:var(--primary);">${currentScore.percent}</strong>
        <span class="subtle">/ 100</span>
      </div>
      <div class="progress" style="margin-top:10px;"><i style="--value:${currentScore.percent}%;"></i></div>
      <p class="subtle" style="margin-top:10px;">${currentScore.answered}/9 scored · ${currentScore.missing} missing evidence · ${filledEvidenceCount(project)} evidence records</p>
    </div>
    ${risks[0] ? `
      <div class="glass-panel panel sm" style="border-color:rgba(186,26,26,.18);">
        <h3 style="font-size:12px;line-height:1;letter-spacing:.05em;text-transform:uppercase;display:flex;gap:6px;align-items:center;">
          <span class="material-symbols-outlined" style="font-size:18px;color:var(--error);">warning</span>Risk Alert
        </h3>
        <p class="subtle" style="margin-top:10px;"><strong>${esc(risks[0].check.name)}</strong> ${esc(risks[0].answer.risk || risks[0].check.recommendation)}</p>
      </div>` : ""}
    <div class="glass-panel panel sm">
      <h3 style="font-size:12px;line-height:1;letter-spacing:.05em;text-transform:uppercase;">真实工具接口</h3>
      <div style="display:grid;gap:10px;margin-top:12px;">
        ${integrations.map((item) => `
          <div>
            <span class="badge ${item.configured ? "secondary" : "neutral"}">${item.configured ? "Configured" : "未配置"}</span>
            <p class="subtle" style="margin-top:4px;">${esc(item.name)}</p>
            ${item.configured ? "" : `<code style="font-size:12px;color:var(--outline);">${esc(item.missingEnv.join(", "))}</code>`}
          </div>`).join("")}
      </div>
    </div>`;
  panel.querySelectorAll("[data-context-view]").forEach((button) => {
    button.addEventListener("click", async () => {
      await flushSave();
      state.view = button.dataset.contextView;
      if (state.view === "reports") await refreshReport();
      render();
    });
  });
}

function input(label, path, value, placeholder) {
  return `<label>${label}<input data-path="${path}" value="${esc(value)}" placeholder="${esc(placeholder)}" /></label>`;
}

function textarea(label, path, value, placeholder, wide = false) {
  return `<label class="${wide ? "wide" : ""}">${label}<textarea data-path="${path}" placeholder="${esc(placeholder)}">${esc(value)}</textarea></label>`;
}

function floatingScore(currentScore) {
  return `
    <div class="floating-score glass-panel">
      <div>
        <p class="eyebrow">Overall Readiness</p>
        <div style="display:flex;align-items:baseline;gap:8px;">
          <strong>${currentScore.percent}</strong><span class="subtle">/ 100</span>
        </div>
      </div>
      <div style="width:1px;height:48px;background:rgba(255,255,255,.55);"></div>
      <div class="grade">${grade(currentScore.percent, currentScore.answered)}</div>
    </div>`;
}

function bindDataFields(project) {
  document.querySelectorAll("[data-path]").forEach((field) => {
    field.addEventListener("input", () => {
      const [group, key] = field.dataset.path.split(".");
      project[group] = project[group] || {};
      project[group][key] = field.value;
      scheduleSave();
      renderContext();
    });
  });
}

function bindScoreFields(project) {
  document.querySelectorAll("[data-score]").forEach((field) => {
    field.addEventListener("input", () => {
      const id = field.dataset.score;
      project.answers[id].score = field.value;
      delete project.computed;
      scheduleSave({ rerender: true, refreshReport: true });
    });
  });
  bindAnswerFields(project);
}

function bindActionFields(project) {
  bindAnswerFields(project);
}

function bindAnswerFields(project) {
  document.querySelectorAll("[data-answer]").forEach((field) => {
    const eventName = field.tagName === "SELECT" ? "change" : "input";
    field.addEventListener(eventName, () => {
      const id = field.dataset.answer;
      project.answers[id][field.dataset.key] = field.value;
      delete project.computed;
      scheduleSave({ refreshReport: true });
    });
  });
}

function bindEvidence(project) {
  document.querySelectorAll("[data-add-evidence]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.addEvidence;
      const templates = {
        pages: { name: "", path: "", finding: "", impact: "" },
        flows: { name: "", steps: "", friction: "", target: "" },
        data: { entity: "", fields: "", source: "", gap: "" },
        permissions: { action: "", data: "", confirm: "", risk: "" }
      };
      project.evidence[key].push({ id: crypto.randomUUID(), ...templates[key] });
      scheduleSave({ refreshReport: true, rerender: true });
    });
  });
  document.querySelectorAll("[data-evidence]").forEach((field) => {
    field.addEventListener("input", () => {
      const rows = project.evidence[field.dataset.evidence];
      rows[Number(field.dataset.index)][field.dataset.field] = field.value;
      scheduleSave({ refreshReport: true });
    });
  });
  document.querySelectorAll("[data-delete-evidence]").forEach((button) => {
    button.addEventListener("click", () => {
      const rows = project.evidence[button.dataset.deleteEvidence];
      rows.splice(Number(button.dataset.index), 1);
      scheduleSave({ refreshReport: true, rerender: true });
    });
  });
}

function scheduleSave({ refreshReport = false, rerender = false } = {}) {
  const project = active();
  if (!project) return;
  project.updatedAt = new Date().toISOString();
  state.isSaving = true;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => persistActive({ refreshReport, rerender }), 360);
}

async function flushSave({ refreshReport = false } = {}) {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  if (state.isSaving) await persistActive({ refreshReport });
}

async function persistActive({ refreshReport = false, rerender = false } = {}) {
  const project = active();
  if (!project) return;
  try {
    const saved = await api(`/api/projects/${encodeURIComponent(project.id)}`, {
      method: "PUT",
      body: JSON.stringify({ project })
    });
    replaceProject(saved.project);
    state.isSaving = false;
    state.lastSavedAt = new Date();
    state.error = "";
    if (refreshReport) await refreshReportText(saved.project.id);
    if (rerender) render();
    else renderContext();
  } catch (error) {
    state.isSaving = false;
    state.error = error.message;
    toast("保存失败", error.message);
  }
}

async function refreshReport() {
  await flushSave({ refreshReport: true });
  await refreshReportText(active().id);
}

async function refreshReportText(id) {
  state.reportText = await api(`/api/projects/${encodeURIComponent(id)}/report`, {
    headers: { accept: "text/markdown" }
  });
}

async function createProject() {
  const created = await api("/api/projects", {
    method: "POST",
    body: JSON.stringify({ project: {} })
  });
  replaceProject(created.project);
  state.view = "cover";
  state.reportText = "";
  toast("Project created", "新项目已保存到后端。");
  render();
}

async function exportJson() {
  await flushSave();
  const latest = await api(`/api/projects/${encodeURIComponent(active().id)}`);
  download(`${fileName(latest.project)}.agent-ready.json`, JSON.stringify(latest.project, null, 2), "application/json;charset=utf-8");
  toast("Export Successful", "项目 JSON 已从后端读取并导出。");
}

async function exportReport() {
  await flushSave({ refreshReport: true });
  if (state.exportFormat === "pdf") {
    toast("PDF 未配置", "当前后端没有 PDF 渲染器，不会生成模拟 PDF。");
    return;
  }
  if (state.exportFormat === "json") {
    await exportJson();
    return;
  }
  const report = await api(`/api/projects/${encodeURIComponent(active().id)}/report`, {
    headers: { accept: "text/markdown" }
  });
  download(`${fileName(active())}-Agent-ready交付报告.md`, report, "text/markdown;charset=utf-8");
  toast("Export Successful", "Markdown 报告已由后端生成并导出。");
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
  return (project.client?.name || "agent-ready-delivery").replace(/[\\/:*?"<>|\s]+/g, "-").slice(0, 60);
}

function initials(value) {
  const text = String(value || "FDE").trim();
  if (/[\u4e00-\u9fa5]/.test(text)) return text.slice(0, 2);
  return text.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "FD";
}

function relativeTime(value) {
  const time = value ? new Date(value).getTime() : Date.now();
  const diff = Math.max(0, Date.now() - time);
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function toast(title, body) {
  const el = document.querySelector("#toast");
  document.querySelector("#toastTitle").textContent = title;
  document.querySelector("#toastBody").textContent = body;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 2600);
}

document.querySelector("#newBtn").addEventListener("click", createProject);

document.querySelector("#searchInput").addEventListener("input", (event) => {
  state.search = event.target.value;
  if (state.view !== "projects") state.view = "projects";
  render();
});

document.querySelector("#importFile").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const imported = await api("/api/import", {
      method: "POST",
      body: JSON.stringify({ project: JSON.parse(await file.text()) })
    });
    replaceProject(imported.project);
    state.view = "cover";
    state.reportText = "";
    toast("Import Successful", "JSON 已通过后端导入并持久化。");
    render();
  } catch (error) {
    toast("导入失败", error.message);
  } finally {
    event.target.value = "";
  }
});

boot();
