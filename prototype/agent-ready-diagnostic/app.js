const sections = [
  ["projects", "folder"],
  ["cover", "info"],
  ["diagnostic", "analytics"],
  ["actions", "auto_fix_high"],
  ["evidence", "menu_book"],
  ["reports", "description"]
];

const messages = {
  zh: {
    htmlLang: "zh-CN",
    brand: "小程序改造工具台",
    productName: "小程序智能体",
    productVersion: "V2.4 改造工作台",
    newProject: "新建项目",
    docs: "文档",
    support: "支持",
    searchPlaceholder: "搜索项目...",
    searchAria: "搜索项目",
    noticeAria: "通知",
    helpAria: "帮助",
    languageAria: "系统语言",
    topDashboard: "工作台",
    topInventory: "资产库",
    topArchive: "归档",
    topSettings: "设置",
    navProjects: "项目",
    navCover: "项目档案",
    navDiagnostic: "诊断评分",
    navActions: "改造行动",
    navEvidence: "证据附录",
    navReports: "报告导出",
    serviceUnavailable: "服务未就绪",
    pendingEval: "待评估",
    notReady: "基础未就绪",
    needsWork: "重点流程改造",
    pilotReady: "可进入试点",
    highlyReady: "高度就绪",
    activeProjects: "活跃项目",
    activeProjectsSub: "查看所有小程序改造项目的诊断与交付进度。",
    importJson: "导入数据文件",
    pipelineSummary: "流程概览",
    pending: "待评估",
    action: "待行动",
    ready: "已就绪",
    recentActivity: "最近动态",
    noProjects: "没有匹配项目。",
    newIntake: "新建录入",
    agentReady: "已诊断",
    scoreLabel: "改造就绪分",
    updated: "更新于",
    justNow: "刚刚",
    minutesAgo: "{n} 分钟前",
    hoursAgo: "{n} 小时前",
    daysAgo: "{n} 天前",
    scoreGenerated: "已生成健康评分",
    projectCreatedActivity: "已创建项目",
    unnamedProject: "未命名小程序",
    industryMissing: "行业未填写",
    ownerFallback: "智能体改造顾问",
    projectFileEyebrow: "项目档案",
    projectFileSub: "客户档案、交付边界和当前路径会真实保存到后端。",
    startDiagnostic: "开始诊断",
    coverTitle: "交付封面 / 项目档案",
    coverSub: "这部分决定客户看到的封面和结论上下文。",
    clientName: "客户 / 小程序名称",
    clientNamePlaceholder: "例如：烟测医美预约小程序",
    industry: "行业",
    industryPlaceholder: "例如：口腔预约",
    goal: "业务目标",
    goalPlaceholder: "例如：提升预约转化",
    owner: "交付负责人",
    ownerPlaceholder: "你的名字或团队",
    summary: "执行摘要",
    summaryPlaceholder: "一句话结论：当前最影响智能体成交的是哪里。",
    currentPath: "当前用户路径",
    currentPathPlaceholder: "用户现在如何完成下单或预约。",
    businessValue: "业务价值",
    businessValuePlaceholder: "客单价、线索价值、转化提升空间。",
    projectHealth: "项目健康度",
    deliveryStatus: "交付状态",
    scored: "已评分",
    missing: "缺证据",
    risks: "风险项",
    diagnosticTitle: "诊断流程",
    diagnosticSub: "按关键维度评估小程序的智能体就绪程度。",
    refreshSchema: "刷新维度",
    highRisk: "高风险",
    mediumRisk: "中风险",
    lowRisk: "低风险",
    unscored: "未评",
    evidence: "证据",
    evidencePlaceholder: "页面、接口、截图、访谈记录",
    risk: "风险",
    riskPlaceholder: "对成交或调用的影响",
    actionAdvice: "行动建议",
    actionTitle: "行动清单",
    actionSub: "把诊断结论转成可执行改造任务，任务来自已持久化评分项。",
    editScores: "编辑评分",
    taskTitle: "任务标题",
    priority: "优先级",
    status: "状态",
    ownerCol: "负责人",
    acceptance: "验收标准",
    noActions: "完成评分后自动生成行动清单。",
    riskTodo: "待补充风险说明",
    inReview: "待复核",
    high: "高",
    medium: "中",
    low: "低",
    evidenceTitle: "证据附录",
    evidenceSub: "页面、流程、数据、权限证据都会保存到项目文件。",
    evidenceGallery: "证据库",
    noEvidence: "暂无证据。右侧新增后会出现在这里。",
    untitledEvidence: "{type}证据 {n}",
    noDescription: "未填写说明",
    pageEvidence: "页面证据",
    flowEvidence: "流程证据",
    dataEvidence: "数据证据",
    permissionEvidence: "权限证据",
    page: "页面",
    path: "路径",
    finding: "发现",
    impact: "影响",
    flow: "流程",
    steps: "当前步骤",
    friction: "摩擦",
    target: "目标状态",
    entity: "对象",
    fields: "字段",
    source: "来源",
    gap: "缺口",
    permissionAction: "动作",
    data: "数据",
    confirm: "确认",
    records: "{n} 条记录",
    add: "新增",
    delete: "删除",
    operation: "操作",
    noRecords: "暂无记录。",
    reportsTitle: "证据与报告导出",
    reportsSub: "报告内容由后端根据已持久化项目生成。",
    exportJson: "导出数据文件",
    exportReport: "导出报告",
    reportPreview: "报告预览",
    summaryTab: "摘要",
    detailsTab: "明细",
    appendixTab: "附录",
    reportLoading: "正在从后端生成报告...",
    exportConfig: "导出配置",
    reportType: "报告类型",
    deliveryHandover: "交付报告",
    auditReport: "审计报告",
    executiveSummary: "管理层摘要",
    format: "格式",
    pdfNotConfigured: "文档文件（未配置）",
    markdownFormat: "文本报告",
    jsonFormat: "数据文件",
    exportStatus: "真实导出状态",
    exportStatusBody: "文本报告和数据文件已接后端。文档文件渲染器尚未配置，选择文档文件会明确返回未配置提示，不生成模拟文件。",
    evidenceAppendix: "证据附录",
    transformationTimeline: "改造时间线",
    rawDiagnosticLogs: "原始诊断日志",
    contextPanel: "上下文面板",
    activeTransformation: "当前改造项目",
    healthScore: "健康评分",
    riskAlert: "风险提醒",
    integrations: "真实工具接口",
    configured: "已配置",
    unconfigured: "未配置",
    overallReadiness: "整体就绪度",
    schemaRefreshed: "维度已刷新",
    schemaRefreshedBody: "评分维度与真实工具状态已从后端刷新。",
    saveFailed: "保存失败",
    saved: "已保存",
    savedBody: "变更已持久化到后端。",
    projectCreated: "项目已创建",
    projectCreatedBody: "新项目已保存到后端。",
    importSuccessful: "导入成功",
    importSuccessfulBody: "数据文件已通过后端导入并持久化。",
    importFailed: "导入失败",
    exportSuccessful: "导出成功",
    exportJsonBody: "项目数据文件已从后端读取并导出。",
    exportMarkdownBody: "文本报告已由后端生成并导出。",
    pdfMissingTitle: "文档文件未配置",
    pdfMissingBody: "当前后端没有文档文件渲染器，不会生成模拟文件。",
    reportFilenameSuffix: "智能体就绪交付报告"
  },
  en: {
    htmlLang: "en",
    brand: "Transformation Toolkit",
    productName: "Mini-Program Agent",
    productVersion: "V2.4 Transformation",
    newProject: "New Project",
    docs: "Documentation",
    support: "Support",
    searchPlaceholder: "Search projects...",
    searchAria: "Search projects",
    noticeAria: "Notifications",
    helpAria: "Help",
    languageAria: "System language",
    topDashboard: "Dashboard",
    topInventory: "Inventory",
    topArchive: "Archive",
    topSettings: "Settings",
    navProjects: "Projects",
    navCover: "Project File",
    navDiagnostic: "Diagnostic",
    navActions: "Transformation",
    navEvidence: "Evidence",
    navReports: "Reports",
    serviceUnavailable: "Service Unavailable",
    pendingEval: "Not Evaluated",
    notReady: "Not Ready",
    needsWork: "Needs Transformation",
    pilotReady: "Pilot Ready",
    highlyReady: "Highly Ready",
    activeProjects: "Active Projects",
    activeProjectsSub: "Review diagnostic and delivery progress across mini-program transformation projects.",
    importJson: "Import JSON",
    pipelineSummary: "Pipeline Summary",
    pending: "Pending",
    action: "Action",
    ready: "Ready",
    recentActivity: "Recent Activity",
    noProjects: "No matching projects.",
    newIntake: "New Intake",
    agentReady: "Diagnosed",
    scoreLabel: "Transformation Score",
    updated: "Updated",
    justNow: "just now",
    minutesAgo: "{n}m ago",
    hoursAgo: "{n}h ago",
    daysAgo: "{n}d ago",
    scoreGenerated: "Health Score Generated",
    projectCreatedActivity: "Project Created",
    unnamedProject: "Untitled Mini-Program",
    industryMissing: "Industry Missing",
    ownerFallback: "Agent-ready FDE",
    projectFileEyebrow: "Project File",
    projectFileSub: "Client profile, delivery scope, and current journey are persisted to the backend.",
    startDiagnostic: "Start Diagnostic",
    coverTitle: "Delivery Cover / Project File",
    coverSub: "This section controls the client-facing cover and conclusion context.",
    clientName: "Client / Mini-Program Name",
    clientNamePlaceholder: "Example: Dental Booking Mini-Program",
    industry: "Industry",
    industryPlaceholder: "Example: Dental Booking",
    goal: "Business Goal",
    goalPlaceholder: "Example: Improve appointment conversion",
    owner: "Delivery Owner",
    ownerPlaceholder: "Your name or team",
    summary: "Executive Summary",
    summaryPlaceholder: "One-sentence diagnosis of the main blocker for agentic conversion.",
    currentPath: "Current User Journey",
    currentPathPlaceholder: "How users currently complete ordering or booking.",
    businessValue: "Business Value",
    businessValuePlaceholder: "Average order value, lead value, and conversion upside.",
    projectHealth: "Project Health",
    deliveryStatus: "Delivery Status",
    scored: "Scored",
    missing: "Missing",
    risks: "Risks",
    diagnosticTitle: "Diagnostic Workflow",
    diagnosticSub: "Evaluate agent readiness across key mini-program dimensions.",
    refreshSchema: "Refresh Schema",
    highRisk: "High Risk",
    mediumRisk: "Medium Risk",
    lowRisk: "Low Risk",
    unscored: "Not Set",
    evidence: "Evidence",
    evidencePlaceholder: "Pages, APIs, screenshots, or interview notes",
    risk: "Risk",
    riskPlaceholder: "Impact on conversion or agent execution",
    actionAdvice: "Action Advice",
    actionTitle: "Action List",
    actionSub: "Turn persisted diagnostic findings into executable transformation tasks.",
    editScores: "Edit Scores",
    taskTitle: "Task Title",
    priority: "Priority",
    status: "Status",
    ownerCol: "Owner",
    acceptance: "Acceptance",
    noActions: "Complete scoring to generate the action list.",
    riskTodo: "Risk description pending",
    inReview: "In Review",
    high: "High",
    medium: "Med",
    low: "Low",
    evidenceTitle: "Evidence Appendix",
    evidenceSub: "Page, flow, data, and permission evidence is saved into the project file.",
    evidenceGallery: "Evidence Gallery",
    noEvidence: "No evidence yet. Add records on the right to populate this gallery.",
    untitledEvidence: "{type} Evidence {n}",
    noDescription: "Description pending",
    pageEvidence: "Page Evidence",
    flowEvidence: "Flow Evidence",
    dataEvidence: "Data Evidence",
    permissionEvidence: "Permission Evidence",
    page: "Page",
    path: "Path",
    finding: "Finding",
    impact: "Impact",
    flow: "Flow",
    steps: "Current Steps",
    friction: "Friction",
    target: "Target State",
    entity: "Entity",
    fields: "Fields",
    source: "Source",
    gap: "Gap",
    permissionAction: "Action",
    data: "Data",
    confirm: "Confirmation",
    records: "{n} records",
    add: "Add",
    delete: "Delete",
    operation: "Operation",
    noRecords: "No records.",
    reportsTitle: "Evidence & Report Export",
    reportsSub: "Reports are generated by the backend from persisted project data.",
    exportJson: "Export JSON",
    exportReport: "Export Report",
    reportPreview: "Report Preview",
    summaryTab: "Summary",
    detailsTab: "Details",
    appendixTab: "Appendix",
    reportLoading: "Generating report from backend...",
    exportConfig: "Export Configuration",
    reportType: "Report Type",
    deliveryHandover: "Delivery Handover",
    auditReport: "Audit Report",
    executiveSummary: "Executive Summary",
    format: "Format",
    pdfNotConfigured: "PDF (Not Configured)",
    markdownFormat: "Markdown",
    jsonFormat: "JSON",
    exportStatus: "Real Export Status",
    exportStatusBody: "Markdown and JSON are wired to the backend. The PDF renderer is not configured, so PDF selection returns a clear unavailable state instead of a simulated file.",
    evidenceAppendix: "Evidence Appendix",
    transformationTimeline: "Transformation Timeline",
    rawDiagnosticLogs: "Raw Diagnostic Logs",
    contextPanel: "Context Panel",
    activeTransformation: "Active Transformation",
    healthScore: "Health Score",
    riskAlert: "Risk Alert",
    integrations: "Real Tool Interfaces",
    configured: "Configured",
    unconfigured: "Not Configured",
    overallReadiness: "Overall Readiness",
    schemaRefreshed: "Schema Refreshed",
    schemaRefreshedBody: "Scoring dimensions and real tool status were refreshed from the backend.",
    saveFailed: "Save Failed",
    saved: "Saved",
    savedBody: "Changes persisted to backend.",
    projectCreated: "Project Created",
    projectCreatedBody: "The new project was saved to the backend.",
    importSuccessful: "Import Successful",
    importSuccessfulBody: "JSON was imported and persisted through the backend.",
    importFailed: "Import Failed",
    exportSuccessful: "Export Successful",
    exportJsonBody: "Project JSON was read from the backend and exported.",
    exportMarkdownBody: "Markdown report was generated by the backend and exported.",
    pdfMissingTitle: "PDF Not Configured",
    pdfMissingBody: "No PDF renderer is configured on the backend, so no simulated PDF was generated.",
    reportFilenameSuffix: "Agent-ready Delivery Report"
  }
};

const checkText = {
  data: {
    enName: "Structured Business Data",
    enDesc: "Whether services, prices, inventory, stores, time slots, and service conditions are machine-readable.",
    enRecommendation: "Normalize the service schema and expose readable fields and APIs."
  },
  intent: {
    enName: "User Intent Mapping",
    enDesc: "Whether budget, distance, time, preferences, and restrictions can map into filters.",
    enRecommendation: "Build an intent dictionary, parameter mapping, and missing-field follow-ups."
  },
  flow: {
    enName: "Short Critical Flows",
    enDesc: "Whether search, selection, confirmation, submission, and payment paths are concise.",
    enRecommendation: "Compress the journey into candidate options, confirmation, and submission."
  },
  realtime: {
    enName: "Real-Time State Trust",
    enDesc: "Whether prices, inventory, appointment slots, schedules, and opening status are current.",
    enRecommendation: "Connect real-time pricing, scheduling, inventory, and business status."
  },
  auth: {
    enName: "Clear Authorization Boundaries",
    enDesc: "Whether phone, location, contact, and sensitive permissions appear at the right step.",
    enRecommendation: "Move authorization to necessary moments and keep a path after failure."
  },
  confirm: {
    enName: "Pre-Payment Confirmation",
    enDesc: "Whether amount, store, time, service content, and cancellation rules are confirmed together.",
    enRecommendation: "Create a unified confirmation page and require user confirmation for critical actions."
  },
  recovery: {
    enName: "Exception Recovery",
    enDesc: "Whether alternatives exist for stockouts, time conflicts, payment failures, and invalid offers.",
    enRecommendation: "Design alternatives, draft recovery, and human fallback."
  },
  after: {
    enName: "After-Sales and Order State",
    enDesc: "Whether rescheduling, cancellation, refund, and service contact are clear and executable.",
    enRecommendation: "Complete order states and after-sales actions."
  },
  ui: {
    enName: "Page and Form Experience",
    enDesc: "Whether the UI is trustworthy, forms are lightweight, and mobile states are complete.",
    enRecommendation: "Redesign key page hierarchy, reduce fields, and complete state feedback."
  }
};

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
  exportFormat: "markdown",
  locale: localStorage.getItem("agentReadyLocale") || "zh"
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
  if (!currentScore.answered) return [t("pendingEval"), "neutral"];
  if (currentScore.percent < 35) return [t("notReady"), "error"];
  if (currentScore.percent < 60) return [t("needsWork"), "amber"];
  if (currentScore.percent < 82) return [t("pilotReady"), "primary"];
  return [t("highlyReady"), "secondary"];
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
  applyLocaleShell();
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
  const items = [t("topDashboard"), t("topInventory"), t("topArchive"), t("topSettings")];
  topLinks.innerHTML = items.map((item, index) => `
    <button class="${index === 0 ? "active" : ""}" type="button">${item}</button>
  `).join("");
}

function renderLeftNav() {
  const nav = document.querySelector("#leftNav");
  nav.innerHTML = sections.map(([id, icon]) => `
    <button class="nav-item ${state.view === id ? "active" : ""}" data-view="${id}" type="button">
      <span class="material-symbols-outlined">${icon}</span>${sectionLabel(id)}
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
        <h2>${t("activeProjects")}</h2>
        <p>${t("activeProjectsSub")}</p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="secondary-btn" id="importBtn" type="button"><span class="material-symbols-outlined">upload_file</span>${t("importJson")}</button>
        <button class="primary-btn" id="newProjectBtn" type="button"><span class="material-symbols-outlined">add</span>${t("newProject")}</button>
      </div>
    </div>
    <div class="grid-12">
      <section class="span-8">
        <div class="grid-12">${projects.length ? projects.map(projectCard).join("") : `<div class="span-12 empty">${t("noProjects")}</div>`}</div>
      </section>
      <aside class="span-4" style="display:grid;gap:24px;align-content:start;">
        <div class="liquid-glass panel">
          <h3>${t("pipelineSummary")}</h3>
          <div class="mini-grid" style="margin-top:16px;">
            <div class="stat-box"><strong>${pending}</strong><span>${t("pending")}</span></div>
            <div class="stat-box" style="background:rgba(134,242,228,.22);"><strong style="color:var(--secondary);">${action}</strong><span>${t("action")}</span></div>
            <div class="stat-box"><strong>${done}</strong><span>${t("ready")}</span></div>
          </div>
        </div>
        <div class="liquid-glass panel">
          <h3>${t("recentActivity")}</h3>
          <div style="display:grid;gap:16px;margin-top:16px;">
            ${state.projects.slice(0, 4).map(activityItem).join("") || `<div class="empty">${t("noRecords")}</div>`}
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
  const title = project.client?.name || t("unnamedProject");
  const industry = project.client?.industry || t("industryMissing");
  const owner = project.client?.owner || t("ownerFallback");
  return `
    <article class="span-6 liquid-glass panel project-card" data-open-project="${esc(project.id)}">
      <div class="card-top">
        <div class="card-title-row">
          <div class="tile-icon"><span class="material-symbols-outlined">storefront</span></div>
          <div>
            <h3>${esc(title)}</h3>
            <p class="eyebrow" style="margin-top:4px;">${esc(industry)} · ${currentScore.answered ? t("agentReady") : t("newIntake")}</p>
          </div>
        </div>
        <span class="badge ${tone}">${label}</span>
      </div>
      <div class="progress-wrap">
        <div class="progress-meta">
          <span class="subtle">${t("scoreLabel")}</span>
          <strong style="color:${tone === "secondary" ? "var(--secondary)" : "var(--primary)"};">${currentScore.percent}/100</strong>
        </div>
        <div class="progress"><i style="--value:${currentScore.percent}%;--bar:${tone === "secondary" ? "var(--secondary)" : "var(--primary)"};"></i></div>
      </div>
      <div style="margin-top:auto;display:flex;align-items:center;justify-content:space-between;padding-top:8px;border-top:1px solid rgba(195,198,215,.34);">
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="tile-icon" style="width:24px;height:24px;border-radius:999px;font-size:10px;color:var(--on-tertiary-container);background:var(--tertiary-container);">${esc(initials(owner))}</div>
          <span class="subtle">${t("updated")} ${relativeTime(project.updatedAt)}</span>
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
        <strong style="display:block;font-size:14px;">${currentScore.answered ? t("scoreGenerated") : t("projectCreatedActivity")}</strong>
        <span class="subtle">${esc(project.client?.name || t("unnamedProject"))} · ${relativeTime(project.updatedAt)}</span>
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
        <p class="eyebrow">${t("projectFileEyebrow")}</p>
        <h2>${esc(project.client.name || t("unnamedProject"))}</h2>
        <p>${t("projectFileSub")}</p>
      </div>
      <button class="primary-btn" id="goScore" type="button"><span class="material-symbols-outlined">analytics</span>${t("startDiagnostic")}</button>
    </div>
    <div class="grid-12">
      <section class="span-8 liquid-glass panel">
        <div class="panel-head">
          <div>
            <h3>${t("coverTitle")}</h3>
            <p class="subtle">${t("coverSub")}</p>
          </div>
          <span class="badge ${tone}">${label}</span>
        </div>
        <div class="form-grid">
          ${input(t("clientName"), "client.name", project.client.name, t("clientNamePlaceholder"))}
          ${input(t("industry"), "client.industry", project.client.industry, t("industryPlaceholder"))}
          ${input(t("goal"), "client.goal", project.client.goal, t("goalPlaceholder"))}
          ${input(t("owner"), "client.owner", project.client.owner, t("ownerPlaceholder"))}
          ${textarea(t("summary"), "client.summary", project.client.summary, t("summaryPlaceholder"), true)}
          ${textarea(t("currentPath"), "client.currentPath", project.client.currentPath, t("currentPathPlaceholder"), true)}
          ${textarea(t("businessValue"), "client.businessValue", project.client.businessValue, t("businessValuePlaceholder"), true)}
        </div>
      </section>
      <aside class="span-4" style="display:grid;gap:24px;align-content:start;">
        <div class="liquid-glass panel">
          <h3>${t("projectHealth")}</h3>
          <div style="display:flex;align-items:baseline;gap:8px;margin-top:12px;">
            <strong style="font-size:48px;line-height:1.2;color:var(--primary);">${currentScore.percent}</strong>
            <span class="subtle">/ 100</span>
          </div>
          <div class="progress" style="margin-top:10px;"><i style="--value:${currentScore.percent}%;"></i></div>
        </div>
        <div class="liquid-glass panel">
          <h3>${t("deliveryStatus")}</h3>
          <div class="mini-grid" style="margin-top:16px;">
            <div class="stat-box"><strong>${currentScore.answered}/9</strong><span>${t("scored")}</span></div>
            <div class="stat-box"><strong>${currentScore.missing}</strong><span>${t("missing")}</span></div>
            <div class="stat-box"><strong>${topRisks(project).length}</strong><span>${t("risks")}</span></div>
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
        <h2>${t("diagnosticTitle")}</h2>
        <p>${t("diagnosticSub")}</p>
      </div>
      <button class="secondary-btn" id="refreshSchema" type="button"><span class="material-symbols-outlined">sync</span>${t("refreshSchema")}</button>
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
    toast(t("schemaRefreshed"), t("schemaRefreshedBody"));
    render();
  });
}

function diagnosticRow(project, check) {
  const answer = project.answers?.[check.id] || {};
  const value = answer.score === "" ? 0 : Number(answer.score);
  const riskTone = answer.priority === "P0" || value <= 2 ? "error" : answer.priority === "P1" || value <= 3 ? "amber" : "secondary";
  const riskLabel = riskTone === "error" ? t("highRisk") : riskTone === "amber" ? t("mediumRisk") : t("lowRisk");
  const display = checkDisplay(check);
  return `
    <article class="glass-panel score-row ${riskTone === "error" ? "risk-high" : ""}" data-check="${esc(check.id)}">
      <div class="score-line">
        <div class="score-title">
          <h4>${esc(display.name)} ${riskTone === "error" ? `<span class="material-symbols-outlined" style="font-size:16px;color:var(--error);">warning</span>` : ""}</h4>
          <p class="subtle">${esc(display.desc)}</p>
        </div>
        <div class="range-box">
          <input data-score="${esc(check.id)}" type="range" min="0" max="5" value="${value}" />
          <span class="score-num">${answer.score === "" ? t("unscored") : `${value}`}</span>
        </div>
        <div class="row-actions">
          <span class="badge ${riskTone}"><span class="material-symbols-outlined" style="font-size:14px;">${riskTone === "error" ? "report" : "check_circle"}</span>${riskLabel}</span>
          <select data-answer="${esc(check.id)}" data-key="priority" style="width:82px;">
            ${["P0", "P1", "P2"].map((priority) => `<option value="${priority}" ${answer.priority === priority ? "selected" : ""}>${priority}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="evidence-area">
        <label>${t("evidence")}<textarea data-answer="${esc(check.id)}" data-key="evidence" placeholder="${esc(t("evidencePlaceholder"))}">${esc(answer.evidence)}</textarea></label>
        <label>${t("risk")}<textarea data-answer="${esc(check.id)}" data-key="risk" placeholder="${esc(t("riskPlaceholder"))}">${esc(answer.risk)}</textarea></label>
        <label class="wide">${t("actionAdvice")}<input data-answer="${esc(check.id)}" data-key="action" value="${esc(answer.action)}" placeholder="${esc(display.recommendation)}" /></label>
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
        <h2>${t("actionTitle")}</h2>
        <p>${t("actionSub")}</p>
      </div>
      <button class="secondary-btn" type="button" id="goDiagnostic"><span class="material-symbols-outlined">analytics</span>${t("editScores")}</button>
    </div>
    <section class="glass-panel table-panel">
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>${t("taskTitle")}</th>
              <th>${t("priority")}</th>
              <th>${t("status")}</th>
              <th>${t("ownerCol")}</th>
              <th>${t("acceptance")}</th>
            </tr>
          </thead>
          <tbody>
            ${risks.length ? risks.map(({ check, answer }) => actionRow(project, check, answer)).join("") : `<tr><td colspan="5"><div class="empty">${t("noActions")}</div></td></tr>`}
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
  const display = checkDisplay(check);
  const defaultAction = answer.action || display.recommendation;
  return `
    <tr data-action-row="${esc(check.id)}">
      <td>
        <strong style="display:block;color:var(--on-surface);">${esc(defaultAction)}</strong>
        <span class="subtle">${esc(display.name)} · ${esc(answer.risk || t("riskTodo"))}</span>
      </td>
      <td>
        <select data-answer="${esc(check.id)}" data-key="priority" style="width:92px;">
          ${["P0", "P1", "P2"].map((item) => `<option value="${item}" ${priority === item ? "selected" : ""}>${item}</option>`).join("")}
        </select>
        <div style="margin-top:6px;"><span class="badge ${priorityTone}">${priority === "P0" ? t("high") : priority === "P1" ? t("medium") : t("low")}</span></div>
      </td>
      <td><span class="badge primary">${t("inReview")}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="tile-icon" style="width:24px;height:24px;border-radius:999px;font-size:10px;">${esc(initials(project.client?.owner || t("ownerFallback")))}</div>
          <span class="subtle">${esc(project.client?.owner || t("ownerFallback"))}</span>
        </div>
      </td>
      <td><input data-answer="${esc(check.id)}" data-key="action" value="${esc(defaultAction)}" /></td>
    </tr>`;
}

function renderEvidence() {
  const project = active();
  const main = document.querySelector("#main");
  main.innerHTML = `
    <div class="page-head">
      <div>
        <h2>${t("evidenceTitle")}</h2>
        <p>${t("evidenceSub")}</p>
      </div>
    </div>
    <div class="grid-12">
      <section class="span-4" style="display:grid;gap:16px;align-content:start;">
        ${evidenceGallery(project)}
      </section>
      <section class="span-8" style="display:grid;gap:16px;">
        ${evidenceEditor(project, "pages", t("pageEvidence"), [["name", t("page")], ["path", t("path")], ["finding", t("finding")], ["impact", t("impact")]])}
        ${evidenceEditor(project, "flows", t("flowEvidence"), [["name", t("flow")], ["steps", t("steps")], ["friction", t("friction")], ["target", t("target")]])}
        ${evidenceEditor(project, "data", t("dataEvidence"), [["entity", t("entity")], ["fields", t("fields")], ["source", t("source")], ["gap", t("gap")]])}
        ${evidenceEditor(project, "permissions", t("permissionEvidence"), [["action", t("permissionAction")], ["data", t("data")], ["confirm", t("confirm")], ["risk", t("risk")]])}
      </section>
    </div>`;
  bindEvidence(project);
}

function evidenceGallery(project) {
  const rows = [
    ...(project.evidence?.pages || []).map((row) => ({ type: t("page"), title: row.name, desc: row.finding, code: row.path, icon: "image" })),
    ...(project.evidence?.flows || []).map((row) => ({ type: t("flow"), title: row.name, desc: row.friction, code: row.steps, icon: "account_tree" })),
    ...(project.evidence?.data || []).map((row) => ({ type: t("data"), title: row.entity, desc: row.gap, code: row.source, icon: "data_object" })),
    ...(project.evidence?.permissions || []).map((row) => ({ type: t("permissionAction"), title: row.action, desc: row.risk, code: row.data, icon: "verified_user" }))
  ];
  return `
    <div>
      <h3 style="font-size:20px;line-height:1.4;margin-bottom:12px;">${t("evidenceGallery")}</h3>
      <div style="display:grid;gap:16px;">
        ${rows.length ? rows.slice(0, 6).map((row, index) => `
          <article class="glass-panel evidence-card">
            <div class="evidence-thumb"><span class="material-symbols-outlined" style="font-size:36px;">${row.icon}</span></div>
            <div>
              <h4 style="font-size:12px;line-height:1;font-weight:800;letter-spacing:.05em;">${esc(row.title || format(t("untitledEvidence"), { type: row.type, n: index + 1 }))}</h4>
              <p class="subtle" style="margin-top:4px;">${esc(row.desc || t("noDescription"))}</p>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(195,198,215,.3);padding-top:8px;">
              <code style="font-size:13px;color:var(--tertiary);">${esc(row.code || row.type)}</code>
              <span class="badge neutral">${row.type}</span>
            </div>
        </article>`).join("") : `<div class="empty">${t("noEvidence")}</div>`}
      </div>
    </div>`;
}

function evidenceEditor(project, key, title, columns) {
  const rows = project.evidence?.[key] || [];
  return `
    <section class="glass-panel table-panel">
      <div class="panel-head" style="padding:16px;margin:0;border-bottom:1px solid rgba(255,255,255,.5);">
        <div><h3>${title}</h3><p class="subtle">${format(t("records"), { n: rows.length })}</p></div>
        <button class="primary-btn" data-add-evidence="${key}" type="button"><span class="material-symbols-outlined">add</span>${t("add")}</button>
      </div>
      <div class="table-scroll">
        ${rows.length ? `<table>
          <thead><tr>${columns.map(([, label]) => `<th>${label}</th>`).join("")}<th>${t("operation")}</th></tr></thead>
          <tbody>${rows.map((row, index) => `
            <tr>
              ${columns.map(([field]) => `<td><textarea data-evidence="${key}" data-index="${index}" data-field="${field}">${esc(row[field] || "")}</textarea></td>`).join("")}
              <td><button class="danger-btn" data-delete-evidence="${key}" data-index="${index}" type="button"><span class="material-symbols-outlined">delete</span>${t("delete")}</button></td>
            </tr>`).join("")}</tbody>
        </table>` : `<div class="empty" style="margin:16px;">${t("noRecords")}</div>`}
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
        <h2>${t("reportsTitle")}</h2>
        <p>${t("reportsSub")}</p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="secondary-btn" id="exportJson" type="button"><span class="material-symbols-outlined">data_object</span>${t("exportJson")}</button>
        <button class="primary-btn" id="exportReport" type="button"><span class="material-symbols-outlined">ios_share</span>${t("exportReport")}</button>
      </div>
    </div>
    <div class="grid-12">
      <section class="span-8">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <h3 style="font-size:20px;line-height:1.4;">${t("reportPreview")}</h3>
          <div class="glass-panel" style="display:flex;border-radius:8px;padding:4px;">
            <button class="ghost-btn" type="button" style="border:0;background:var(--surface);color:var(--on-surface);">${t("summaryTab")}</button>
            <button class="ghost-btn" type="button" style="border:0;">${t("detailsTab")}</button>
            <button class="ghost-btn" type="button" style="border:0;">${t("appendixTab")}</button>
          </div>
        </div>
        <pre class="report-paper">${esc(state.reportText || t("reportLoading"))}</pre>
      </section>
      <aside class="span-4 liquid-glass panel" style="align-self:start;">
        <h3>${t("exportConfig")}</h3>
        <div style="display:grid;gap:18px;margin-top:18px;">
          <label>${t("reportType")}
            <select id="reportType">
              <option>${t("deliveryHandover")}</option>
              <option>${t("auditReport")}</option>
              <option>${t("executiveSummary")}</option>
            </select>
          </label>
          <label>${t("format")}
            <select id="formatSelect">
              <option value="markdown" ${state.exportFormat === "markdown" ? "selected" : ""}>${t("markdownFormat")}</option>
              <option value="json" ${state.exportFormat === "json" ? "selected" : ""}>${t("jsonFormat")}</option>
              <option value="pdf" ${state.exportFormat === "pdf" ? "selected" : ""}>${t("pdfNotConfigured")}</option>
            </select>
          </label>
          <div class="glass-panel sm" style="border-radius:8px;">
            <strong style="display:block;font-size:12px;letter-spacing:.05em;">${t("exportStatus")}</strong>
            <p class="subtle" style="margin-top:8px;">${t("exportStatusBody")}</p>
          </div>
          <div style="display:grid;gap:8px;">
            <label style="display:flex;justify-content:space-between;align-items:center;grid-template-columns:1fr auto;">
              ${t("evidenceAppendix")} <input checked type="checkbox" style="width:auto;" />
            </label>
            <label style="display:flex;justify-content:space-between;align-items:center;grid-template-columns:1fr auto;">
              ${t("transformationTimeline")} <input checked type="checkbox" style="width:auto;" />
            </label>
            <label style="display:flex;justify-content:space-between;align-items:center;grid-template-columns:1fr auto;">
              ${t("rawDiagnosticLogs")} <input type="checkbox" style="width:auto;" />
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
    panel.innerHTML = `<div class="empty">${t("noProjects")}</div>`;
    return;
  }
  const currentScore = score(project);
  const risks = topRisks(project);
  panel.innerHTML = `
    <div>
      <h2 class="eyebrow" style="color:var(--secondary);">${t("contextPanel")}</h2>
      <p class="subtle" style="margin-top:6px;">${esc(project.client?.name || t("activeTransformation"))}</p>
    </div>
    <nav class="context-nav">
      ${sections.filter(([id]) => id !== "projects").map(([id, icon]) => `
        <button class="context-link ${state.view === id ? "active" : ""}" data-context-view="${id}" type="button">
          <span class="material-symbols-outlined">${icon}</span>${sectionLabel(id)}
        </button>`).join("")}
    </nav>
    <div class="glass-panel panel sm">
      <h3 style="font-size:12px;line-height:1;letter-spacing:.05em;text-transform:uppercase;">${t("healthScore")}</h3>
      <div style="display:flex;align-items:baseline;gap:8px;margin-top:10px;">
        <strong style="font-size:40px;line-height:1.2;color:var(--primary);">${currentScore.percent}</strong>
        <span class="subtle">/ 100</span>
      </div>
      <div class="progress" style="margin-top:10px;"><i style="--value:${currentScore.percent}%;"></i></div>
      <p class="subtle" style="margin-top:10px;">${currentScore.answered}/9 ${t("scored")} · ${currentScore.missing} ${t("missing")} · ${filledEvidenceCount(project)} ${t("evidence")}</p>
    </div>
    ${risks[0] ? `
      <div class="glass-panel panel sm" style="border-color:rgba(186,26,26,.18);">
        <h3 style="font-size:12px;line-height:1;letter-spacing:.05em;text-transform:uppercase;display:flex;gap:6px;align-items:center;">
          <span class="material-symbols-outlined" style="font-size:18px;color:var(--error);">warning</span>${t("riskAlert")}
        </h3>
        <p class="subtle" style="margin-top:10px;"><strong>${esc(checkDisplay(risks[0].check).name)}</strong> ${esc(risks[0].answer.risk || checkDisplay(risks[0].check).recommendation)}</p>
      </div>` : ""}
    <div class="glass-panel panel sm">
      <h3 style="font-size:12px;line-height:1;letter-spacing:.05em;text-transform:uppercase;">${t("integrations")}</h3>
      <div style="display:grid;gap:10px;margin-top:12px;">
        ${integrations.map((item) => `
          <div>
            <span class="badge ${item.configured ? "secondary" : "neutral"}">${item.configured ? t("configured") : t("unconfigured")}</span>
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
        <p class="eyebrow">${t("overallReadiness")}</p>
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
    toast(t("saveFailed"), error.message);
  }
}

async function refreshReport() {
  await flushSave({ refreshReport: true });
  await refreshReportText(active().id);
}

async function refreshReportText(id) {
  state.reportText = await api(`/api/projects/${encodeURIComponent(id)}/report?locale=${encodeURIComponent(state.locale)}`, {
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
  toast(t("projectCreated"), t("projectCreatedBody"));
  render();
}

async function exportJson() {
  await flushSave();
  const latest = await api(`/api/projects/${encodeURIComponent(active().id)}`);
  download(`${fileName(latest.project)}.agent-ready.json`, JSON.stringify(latest.project, null, 2), "application/json;charset=utf-8");
  toast(t("exportSuccessful"), t("exportJsonBody"));
}

async function exportReport() {
  await flushSave({ refreshReport: true });
  if (state.exportFormat === "pdf") {
    toast(t("pdfMissingTitle"), t("pdfMissingBody"));
    return;
  }
  if (state.exportFormat === "json") {
    await exportJson();
    return;
  }
  const report = await api(`/api/projects/${encodeURIComponent(active().id)}/report?locale=${encodeURIComponent(state.locale)}`, {
    headers: { accept: "text/markdown" }
  });
  download(`${fileName(active())}-${t("reportFilenameSuffix")}.md`, report, "text/markdown;charset=utf-8");
  toast(t("exportSuccessful"), t("exportMarkdownBody"));
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

function t(key) {
  return messages[state.locale]?.[key] || messages.zh[key] || key;
}

function format(template, values) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

function sectionLabel(id) {
  const map = {
    projects: "navProjects",
    cover: "navCover",
    diagnostic: "navDiagnostic",
    actions: "navActions",
    evidence: "navEvidence",
    reports: "navReports"
  };
  return t(map[id] || id);
}

function checkDisplay(check) {
  const mapped = checkText[check.id];
  if (state.locale === "en" && mapped) {
    return {
      name: mapped.enName,
      desc: mapped.enDesc,
      recommendation: mapped.enRecommendation
    };
  }
  return {
    name: check.name,
    desc: check.desc,
    recommendation: check.recommendation
  };
}

function applyLocaleShell() {
  document.documentElement.lang = t("htmlLang");
  document.title = t("brand");
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelector("#searchInput").placeholder = t("searchPlaceholder");
  document.querySelector("#searchLabel").setAttribute("aria-label", t("searchAria"));
  document.querySelector(".locale-switch").setAttribute("aria-label", t("languageAria"));
  document.querySelector("#noticeBtn").setAttribute("aria-label", t("noticeAria"));
  document.querySelector("#helpBtn").setAttribute("aria-label", t("helpAria"));
  document.querySelector("#localeZh").classList.toggle("active", state.locale === "zh");
  document.querySelector("#localeEn").classList.toggle("active", state.locale === "en");
  document.querySelector("#toastTitle").textContent = t("saved");
  document.querySelector("#toastBody").textContent = t("savedBody");
}

function initials(value) {
  const text = String(value || t("ownerFallback")).trim();
  if (/[\u4e00-\u9fa5]/.test(text)) return text.slice(0, 2);
  return text.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "FD";
}

function relativeTime(value) {
  const time = value ? new Date(value).getTime() : Date.now();
  const diff = Math.max(0, Date.now() - time);
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return t("justNow");
  if (minutes < 60) return format(t("minutesAgo"), { n: minutes });
  const hours = Math.round(minutes / 60);
  if (hours < 24) return format(t("hoursAgo"), { n: hours });
  return format(t("daysAgo"), { n: Math.round(hours / 24) });
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

document.querySelectorAll("[data-locale]").forEach((button) => {
  button.addEventListener("click", async () => {
    await flushSave({ refreshReport: state.view === "reports" });
    state.locale = button.dataset.locale;
    localStorage.setItem("agentReadyLocale", state.locale);
    state.reportText = "";
    if (state.view === "reports") await refreshReportText(active().id);
    render();
  });
});

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
    toast(t("importSuccessful"), t("importSuccessfulBody"));
    render();
  } catch (error) {
    toast(t("importFailed"), error.message);
  } finally {
    event.target.value = "";
  }
});

boot();
