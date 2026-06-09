const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(ROOT, "data");
const DB_PATH = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : path.join(DATA_DIR, "projects.json");
const STATIC_DIR = path.join(ROOT, "prototype", "agent-ready-diagnostic");
const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || "127.0.0.1";

const checks = [
  ["data", "业务数据结构化", "商品/服务、价格、库存、门店、时间、服务条件是否机器可读。", 12, "整理服务 schema，补齐可读字段和接口。"],
  ["intent", "用户意图映射", "预算、距离、时间、偏好、禁忌能否转成筛选条件。", 10, "建立意图词典、参数映射和缺失字段追问。"],
  ["flow", "关键流程短链路", "查询、选择、确认、提交、支付路径是否足够短。", 12, "收敛为候选方案、确认、提交三段式流程。"],
  ["realtime", "实时状态可信", "价格、库存、号源、排班、门店营业状态是否实时。", 10, "接入实时价格、排班、库存和营业状态。"],
  ["auth", "授权边界清楚", "手机号、定位、联系人、健康信息等权限是否在正确节点出现。", 8, "把授权放在必要节点，并保留失败后的继续路径。"],
  ["confirm", "支付/预约前确认", "金额、门店、时间、服务内容、取消规则是否集中确认。", 12, "建立统一确认页，关键动作必须用户确认。"],
  ["recovery", "异常恢复", "无库存、时间冲突、支付失败、优惠不可用时是否有替代方案。", 12, "设计替代方案、草稿保留和人工兜底。"],
  ["after", "售后与订单状态", "改约、取消、退款、联系客服是否清晰可执行。", 8, "补齐订单状态和售后动作。"],
  ["ui", "页面与表单体验", "视觉是否可信，表单是否过重，移动端状态是否完整。", 16, "重做关键页面层级，减少字段，补齐状态反馈。"]
].map(([id, name, desc, weight, recommendation]) => ({ id, name, desc, weight, recommendation }));

const integrationDefinitions = [
  {
    id: "wechat-miniprogram-source",
    name: "微信小程序源码与页面结构分析",
    category: "source",
    requiredEnv: ["WECHAT_MINIPROGRAM_APPID", "WECHAT_MINIPROGRAM_ACCESS_TOKEN"],
    capabilities: ["页面路由读取", "服务字段抽取", "授权节点检查"]
  },
  {
    id: "commerce-catalog",
    name: "商品/服务目录结构化",
    category: "catalog",
    requiredEnv: ["CATALOG_API_BASE_URL", "CATALOG_API_TOKEN"],
    capabilities: ["服务 schema 同步", "价格库存校验", "可售状态校验"]
  },
  {
    id: "booking-inventory",
    name: "预约/号源实时状态",
    category: "availability",
    requiredEnv: ["BOOKING_API_BASE_URL", "BOOKING_API_TOKEN"],
    capabilities: ["可约时间查询", "号源冲突校验", "异常恢复建议"]
  },
  {
    id: "design-audit",
    name: "小程序 UI 体验升级审查",
    category: "design",
    requiredEnv: ["DESIGN_AUDIT_PROVIDER", "DESIGN_AUDIT_API_KEY"],
    capabilities: ["页面截图审查", "表单负担评估", "移动端可用性检查"]
  }
];

const blankProject = () => ({
  id: crypto.randomUUID(),
  section: "cover",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  client: {
    name: "",
    industry: "",
    goal: "",
    owner: "",
    summary: "",
    currentPath: "",
    businessValue: ""
  },
  answers: Object.fromEntries(checks.map((check) => [check.id, { score: "", evidence: "", risk: "", priority: "P2", action: "" }])),
  evidence: {
    pages: [],
    flows: [],
    data: [],
    permissions: []
  }
});

async function ensureDb() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DB_PATH);
  } catch {
    await writeDb({ version: 1, projects: [] });
  }
}

async function readDb() {
  await ensureDb();
  const raw = await fs.readFile(DB_PATH, "utf8");
  const parsed = JSON.parse(raw);
  return {
    version: 1,
    projects: Array.isArray(parsed.projects) ? parsed.projects.map(normalizeProject) : []
  };
}

async function writeDb(db) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const temp = `${DB_PATH}.tmp`;
  await fs.writeFile(temp, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(temp, DB_PATH);
}

function normalizeProject(input = {}) {
  const base = blankProject();
  const project = {
    ...base,
    ...input,
    client: { ...base.client, ...(input.client || {}) },
    answers: { ...base.answers, ...(input.answers || {}) },
    evidence: {
      pages: Array.isArray(input.evidence?.pages) ? input.evidence.pages : [],
      flows: Array.isArray(input.evidence?.flows) ? input.evidence.flows : [],
      data: Array.isArray(input.evidence?.data) ? input.evidence.data : [],
      permissions: Array.isArray(input.evidence?.permissions) ? input.evidence.permissions : []
    }
  };
  checks.forEach((check) => {
    project.answers[check.id] = {
      score: "",
      evidence: "",
      risk: "",
      priority: "P2",
      action: "",
      ...(project.answers[check.id] || {})
    };
  });
  project.id = String(project.id || crypto.randomUUID());
  project.section = project.section || "cover";
  project.createdAt = project.createdAt || new Date().toISOString();
  project.updatedAt = project.updatedAt || new Date().toISOString();
  delete project.computed;
  return project;
}

function readinessScore(project) {
  let points = 0;
  let answered = 0;
  let missing = 0;
  checks.forEach((check) => {
    const answer = project.answers[check.id];
    if (answer.score !== "") {
      answered += 1;
      points += (Number(answer.score) / 5) * check.weight;
      if (!String(answer.evidence || "").trim()) missing += 1;
    }
  });
  const max = checks.reduce((sum, check) => sum + check.weight, 0);
  return {
    points: Math.round(points),
    max,
    percent: Math.round((points / max) * 100),
    answered,
    missing
  };
}

function statusFor(score) {
  if (!score.answered) return "待评估";
  if (score.percent < 35) return "基础未就绪";
  if (score.percent < 60) return "重点流程改造";
  if (score.percent < 82) return "可进入试点";
  return "高度就绪";
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

function integrationStatus(definition) {
  const missingEnv = definition.requiredEnv.filter((key) => !process.env[key]);
  return {
    ...definition,
    configured: missingEnv.length === 0,
    missingEnv
  };
}

function integrationResult(definition, body) {
  const status = integrationStatus(definition);
  if (!status.configured) {
    return {
      ready: false,
      status,
      inputAccepted: Boolean(body && Object.keys(body).length),
      message: "该真实工具接口尚未配置凭证或上游地址，系统不会返回演示分析结果。"
    };
  }
  return {
    ready: true,
    status,
    message: "接口凭证已配置。请在对应适配器中接入真实上游调用后启用该动作。"
  };
}

function buildReport(project, locale = "zh") {
  if (locale === "en") return buildEnglishReport(project);
  const score = readinessScore(project);
  const lines = [];
  lines.push(`# ${project.client.name || "未命名小程序"} 智能体就绪改造交付报告`);
  lines.push("");
  lines.push(`- 行业：${project.client.industry || "未填写"}`);
  lines.push(`- 业务目标：${project.client.goal || "未填写"}`);
  lines.push(`- 交付负责人：${project.client.owner || "未填写"}`);
  lines.push(`- 智能体就绪分数：${score.points}/${score.max} (${score.percent}%)`);
  lines.push(`- 结论：${statusFor(score)}`);
  lines.push("");
  lines.push("## 执行摘要");
  lines.push(project.client.summary || "未填写。");
  lines.push("");
  lines.push("## 当前路径与业务价值");
  lines.push(`- 当前路径：${project.client.currentPath || "未填写"}`);
  lines.push(`- 业务价值：${project.client.businessValue || "未填写"}`);
  lines.push("");
  lines.push("## 优先行动清单");
  const risks = topRisks(project);
  if (!risks.length) lines.push("暂无。");
  risks.forEach(({ check, answer }, index) => {
    lines.push(`${index + 1}. ${answer.priority} · ${check.name}: ${answer.risk || answer.action || check.recommendation}`);
  });
  lines.push("");
  lines.push("## 诊断明细");
  checks.forEach((check) => {
    const answer = project.answers[check.id];
    lines.push(`### ${check.name}`);
    lines.push(`- 分数：${answer.score === "" ? "未评分" : `${answer.score}/5`}`);
    lines.push(`- 优先级：${answer.priority}`);
    lines.push(`- 证据：${answer.evidence || "缺少证据"}`);
    lines.push(`- 风险：${answer.risk || "未填写"}`);
    lines.push(`- 行动：${answer.action || check.recommendation}`);
    lines.push("");
  });
  appendEvidence(lines, "页面证据", project.evidence.pages, [["name", "页面"], ["path", "路径"], ["finding", "发现"], ["impact", "影响"]]);
  appendEvidence(lines, "流程证据", project.evidence.flows, [["name", "流程"], ["steps", "步骤"], ["friction", "摩擦"], ["target", "目标状态"]]);
  appendEvidence(lines, "数据证据", project.evidence.data, [["entity", "对象"], ["fields", "字段"], ["source", "来源"], ["gap", "缺口"]]);
  appendEvidence(lines, "权限证据", project.evidence.permissions, [["action", "动作"], ["data", "数据"], ["confirm", "确认"], ["risk", "风险"]]);
  return lines.join("\n");
}

function buildEnglishReport(project) {
  const score = readinessScore(project);
  const lines = [];
  lines.push(`# ${project.client.name || "Untitled Mini-Program"} Agent-ready Transformation Report`);
  lines.push("");
  lines.push(`- Industry: ${project.client.industry || "Not provided"}`);
  lines.push(`- Business goal: ${project.client.goal || "Not provided"}`);
  lines.push(`- Delivery owner: ${project.client.owner || "Not provided"}`);
  lines.push(`- Agent-ready score: ${score.points}/${score.max} (${score.percent}%)`);
  lines.push(`- Conclusion: ${statusForEnglish(score)}`);
  lines.push("");
  lines.push("## Executive Summary");
  lines.push(project.client.summary || "Not provided.");
  lines.push("");
  lines.push("## Current Journey and Business Value");
  lines.push(`- Current journey: ${project.client.currentPath || "Not provided"}`);
  lines.push(`- Business value: ${project.client.businessValue || "Not provided"}`);
  lines.push("");
  lines.push("## Priority Action List");
  const risks = topRisks(project);
  if (!risks.length) lines.push("None.");
  risks.forEach(({ check, answer }, index) => {
    const label = englishCheck(check);
    lines.push(`${index + 1}. ${answer.priority} · ${label.name}: ${answer.risk || answer.action || label.recommendation}`);
  });
  lines.push("");
  lines.push("## Diagnostic Details");
  checks.forEach((check) => {
    const answer = project.answers[check.id];
    const label = englishCheck(check);
    lines.push(`### ${label.name}`);
    lines.push(`- Score: ${answer.score === "" ? "Not scored" : `${answer.score}/5`}`);
    lines.push(`- Priority: ${answer.priority}`);
    lines.push(`- Evidence: ${answer.evidence || "Missing evidence"}`);
    lines.push(`- Risk: ${answer.risk || "Not provided"}`);
    lines.push(`- Action: ${answer.action || label.recommendation}`);
    lines.push("");
  });
  appendEvidence(lines, "Page Evidence", project.evidence.pages, [["name", "Page"], ["path", "Path"], ["finding", "Finding"], ["impact", "Impact"]]);
  appendEvidence(lines, "Flow Evidence", project.evidence.flows, [["name", "Flow"], ["steps", "Steps"], ["friction", "Friction"], ["target", "Target state"]]);
  appendEvidence(lines, "Data Evidence", project.evidence.data, [["entity", "Entity"], ["fields", "Fields"], ["source", "Source"], ["gap", "Gap"]]);
  appendEvidence(lines, "Permission Evidence", project.evidence.permissions, [["action", "Action"], ["data", "Data"], ["confirm", "Confirmation"], ["risk", "Risk"]]);
  return lines.join("\n");
}

function statusForEnglish(score) {
  if (!score.answered) return "Not evaluated";
  if (score.percent < 35) return "Not ready";
  if (score.percent < 60) return "Needs core transformation";
  if (score.percent < 82) return "Ready for pilot";
  return "Highly ready";
}

function englishCheck(check) {
  const labels = {
    data: ["Structured Business Data", "Normalize the service schema and expose readable fields and APIs."],
    intent: ["User Intent Mapping", "Build an intent dictionary, parameter mapping, and missing-field follow-ups."],
    flow: ["Short Critical Flows", "Compress the journey into candidate options, confirmation, and submission."],
    realtime: ["Real-Time State Trust", "Connect real-time pricing, scheduling, inventory, and business status."],
    auth: ["Clear Authorization Boundaries", "Move authorization to necessary moments and keep a path after failure."],
    confirm: ["Pre-Payment Confirmation", "Create a unified confirmation page and require user confirmation for critical actions."],
    recovery: ["Exception Recovery", "Design alternatives, draft recovery, and human fallback."],
    after: ["After-Sales and Order State", "Complete order states and after-sales actions."],
    ui: ["Page and Form Experience", "Redesign key page hierarchy, reduce fields, and complete state feedback."]
  };
  const [name, recommendation] = labels[check.id] || [check.name, check.recommendation];
  return { name, recommendation };
}

function appendEvidence(lines, title, rows, columns) {
  lines.push(`## ${title}`);
  if (!rows.length) {
    lines.push("暂无记录。");
    lines.push("");
    return;
  }
  rows.forEach((row, index) => {
    lines.push(`### ${index + 1}. ${row[columns[0][0]] || "未命名"}`);
    columns.slice(1).forEach(([key, label]) => lines.push(`- ${label}：${row[key] || "未填写"}`));
    lines.push("");
  });
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body)
  });
  res.end(body);
}

function sendText(res, status, text, contentType = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "content-type": contentType,
    "content-length": Buffer.byteLength(text)
  });
  res.end(text);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function routeApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/health") {
    const db = await readDb();
    return sendJson(res, 200, { ok: true, storage: DB_PATH, projects: db.projects.length, checks: checks.length });
  }

  if (req.method === "GET" && url.pathname === "/api/schema") {
    return sendJson(res, 200, { checks, integrations: integrationDefinitions.map(integrationStatus) });
  }

  if (req.method === "GET" && url.pathname === "/api/integrations") {
    return sendJson(res, 200, { integrations: integrationDefinitions.map(integrationStatus) });
  }

  const integrationRunMatch = url.pathname.match(/^\/api\/integrations\/([^/]+)\/run$/);
  if (integrationRunMatch && req.method === "POST") {
    const id = decodeURIComponent(integrationRunMatch[1]);
    const definition = integrationDefinitions.find((item) => item.id === id);
    if (!definition) return sendJson(res, 404, { error: "Integration not found" });
    const body = await readBody(req);
    const result = integrationResult(definition, body);
    return sendJson(res, result.ready ? 202 : 501, result);
  }

  if (req.method === "GET" && url.pathname === "/api/projects") {
    const db = await readDb();
    return sendJson(res, 200, { projects: db.projects.map(withComputed) });
  }

  if (req.method === "POST" && url.pathname === "/api/projects") {
    const db = await readDb();
    const body = await readBody(req);
    const project = normalizeProject({ ...blankProject(), ...(body.project || body || {}) });
    db.projects.unshift(project);
    await writeDb(db);
    return sendJson(res, 201, { project: withComputed(project) });
  }

  const projectMatch = url.pathname.match(/^\/api\/projects\/([^/]+)$/);
  if (projectMatch) {
    const id = decodeURIComponent(projectMatch[1]);
    const db = await readDb();
    const index = db.projects.findIndex((project) => project.id === id);
    if (index === -1) return sendJson(res, 404, { error: "Project not found" });

    if (req.method === "GET") {
      return sendJson(res, 200, { project: withComputed(db.projects[index]) });
    }

    if (req.method === "PUT") {
      const body = await readBody(req);
      const current = db.projects[index];
      db.projects[index] = normalizeProject({ ...current, ...(body.project || body || {}), id: current.id, createdAt: current.createdAt });
      await writeDb(db);
      return sendJson(res, 200, { project: withComputed(db.projects[index]) });
    }

    if (req.method === "DELETE") {
      const [deleted] = db.projects.splice(index, 1);
      await writeDb(db);
      return sendJson(res, 200, { deleted: deleted.id });
    }
  }

  const reportMatch = url.pathname.match(/^\/api\/projects\/([^/]+)\/report$/);
  if (reportMatch && req.method === "GET") {
    const id = decodeURIComponent(reportMatch[1]);
    const db = await readDb();
    const project = db.projects.find((item) => item.id === id);
    if (!project) return sendJson(res, 404, { error: "Project not found" });
    return sendText(res, 200, buildReport(project, url.searchParams.get("locale") === "en" ? "en" : "zh"), "text/markdown; charset=utf-8");
  }

  if (req.method === "POST" && url.pathname === "/api/import") {
    const body = await readBody(req);
    const project = normalizeProject({ ...(body.project || body || {}), id: crypto.randomUUID(), createdAt: new Date().toISOString() });
    const db = await readDb();
    db.projects.unshift(project);
    await writeDb(db);
    return sendJson(res, 201, { project: withComputed(project) });
  }

  return sendJson(res, 404, { error: "API route not found" });
}

function withComputed(project) {
  const score = readinessScore(project);
  return { ...project, computed: { score, status: statusFor(score), risks: topRisks(project).length } };
}

async function serveStatic(req, res, url) {
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const relativePath = requestedPath.replace(/^\/prototype\/agent-ready-diagnostic/, "") || "/index.html";
  const filePath = path.normalize(path.join(STATIC_DIR, relativePath));
  if (!filePath.startsWith(STATIC_DIR)) return sendText(res, 403, "Forbidden");
  try {
    const stat = await fs.stat(filePath);
    const target = stat.isDirectory() ? path.join(filePath, "index.html") : filePath;
    const content = await fs.readFile(target);
    res.writeHead(200, { "content-type": contentType(target), "content-length": content.length });
    res.end(content);
  } catch {
    sendText(res, 404, "Not found");
  }
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".js") return "text/javascript; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".json") return "application/json; charset=utf-8";
  if (ext === ".svg") return "image/svg+xml";
  return "application/octet-stream";
}

async function handle(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);
    if (url.pathname.startsWith("/api/")) return await routeApi(req, res, url);
    return await serveStatic(req, res, url);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: error.message || "Internal server error" });
  }
}

if (require.main === module) {
  ensureDb()
    .then(() => {
      http.createServer(handle).listen(PORT, HOST, () => {
        console.log(`Agent-ready delivery server listening at http://${HOST}:${PORT}/`);
      });
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = {
  handle,
  checks,
  integrationDefinitions,
  blankProject,
  normalizeProject,
  readinessScore,
  buildReport,
  DB_PATH
};
