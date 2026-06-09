const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs/promises");

const ROOT = path.resolve(__dirname, "..");
const PORT = 8799;
const BASE = `http://127.0.0.1:${PORT}`;
const SMOKE_DATA_DIR = path.join(ROOT, ".tmp-smoke-data");

async function request(pathname, options = {}) {
  const response = await fetch(`${BASE}${pathname}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json") && text ? JSON.parse(text) : text;
  if (!response.ok) throw new Error(`${options.method || "GET"} ${pathname} failed: ${response.status} ${text}`);
  return body;
}

async function waitForServer() {
  for (let i = 0; i < 40; i += 1) {
    try {
      await request("/api/health");
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }
  throw new Error("Server did not start");
}

async function main() {
  const dataPath = path.join(SMOKE_DATA_DIR, "projects.json");
  await fs.rm(SMOKE_DATA_DIR, { recursive: true, force: true });

  const child = spawn(process.execPath, ["server/index.js"], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(PORT), HOST: "127.0.0.1", DATA_DIR: SMOKE_DATA_DIR },
    stdio: ["ignore", "pipe", "pipe"]
  });

  try {
    await waitForServer();
    const health = await request("/api/health");
    if (!health.ok || health.checks !== 9) throw new Error("Invalid health response");

    const created = await request("/api/projects", {
      method: "POST",
      body: JSON.stringify({
        project: {
          client: {
            name: "烟测口腔预约小程序",
            industry: "口腔预约",
            goal: "提升洁牙预约转化",
            owner: "Agent-ready FDE",
            summary: "当前瓶颈是价格/排班不可读，以及预约前缺少统一确认页。",
            currentPath: "用户从公众号菜单进入小程序，选择套餐、门店、时间并填写手机号。",
            businessValue: "洁牙线索客单价 398-680 元。"
          }
        }
      })
    });
    const id = created.project.id;

    const updated = await request(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        project: {
          answers: {
            data: { score: "2", evidence: "价格以图片展示，排班没有接口。", risk: "Agent 无法稳定筛选。", priority: "P0", action: "整理服务 schema。"},
            confirm: { score: "1", evidence: "提交前没有集中确认页。", risk: "容易误约。", priority: "P0", action: "新增确认页。"},
            ui: { score: "2", evidence: "页面层级弱，表单密集。", risk: "完成率低。", priority: "P1", action: "重做详情页。"}
          },
          evidence: {
            pages: [{ id: "p1", name: "洁牙详情页", path: "/pages/service/detail", finding: "价格图文混排。", impact: "Agent 不能可靠读取价格。" }],
            flows: [],
            data: [],
            permissions: []
          }
        }
      })
    });

    if (updated.project.computed.score.answered !== 3) throw new Error("Score not computed");
    const report = await request(`/api/projects/${id}/report`, { headers: { accept: "text/markdown" } });
    for (const phrase of ["智能体就绪改造交付报告", "烟测口腔预约小程序", "优先行动清单", "洁牙详情页"]) {
      if (!report.includes(phrase)) throw new Error(`Report missing ${phrase}`);
    }

    const persisted = JSON.parse(await fs.readFile(dataPath, "utf8"));
    if (!persisted.projects.some((project) => project.id === id)) throw new Error("Project not persisted to disk");

    console.log(JSON.stringify({
      ok: true,
      projectId: id,
      score: updated.project.computed.score,
      reportLength: report.length,
      persistedProjects: persisted.projects.length
    }, null, 2));
  } finally {
    child.kill();
    await fs.rm(SMOKE_DATA_DIR, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
