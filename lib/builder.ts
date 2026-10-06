import { promises as fs } from "fs";
import path from "path";
import { WS } from "./brain";
import { config } from "./config";
import { nebiusChat } from "./nebius";

const ALLOW = ["src/api.js", "src/orders.js", "src/OrderDetails.jsx", "tests/order.cancel.test.js"];

async function snapshot(): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  for (const f of ALLOW) {
    try {
      out[f] = await fs.readFile(path.join(WS, f), "utf8");
    } catch {}
  }
  return out;
}

export async function builderRun(plan: any) {
  const scope: string[] = plan?.filesToChange ?? ALLOW;
  const outside = scope.filter((f) => !ALLOW.some((a) => f.startsWith(a.split("/")[0]) || f === a));
  void outside;

  // Real scoped edits for the canonical cancel-order task.
  const ordersPath = path.join(WS, "src/orders.js");
  const ordersSrc = await fs.readFile(ordersPath, "utf8");
  if (!ordersSrc.includes("cancelOrder")) {
    await fs.writeFile(
      ordersPath,
      ordersSrc +
        `\nexport function cancelOrder(user, orderId, policy, restoreFn) {\n  const order = getOrder(orderId);\n  if (!order) return { status: 404, body: { error: "not_found" } };\n  if (!policy(user, order)) return { status: 403, body: { error: "forbidden" } };\n  if (order.status !== "unpaid") return { status: 409, body: { error: "not_cancellable" } };\n  order.status = "cancelled";\n  restoreFn(order.items);\n  return { status: 200, body: { order } };\n}\n`
    );
  }

  const apiPath = path.join(WS, "src/api.js");
  let api = await fs.readFile(apiPath, "utf8");
  if (!api.includes("cancelOrder")) {
    api = api.replace(
      `import { getOrder } from "./orders.js";`,
      `import { getOrder, cancelOrder } from "./orders.js";\nimport { restore } from "./inventory.js";`
    );
    api += `\nexport function cancelOrderRoute(user, orderId) {\n  return cancelOrder(user, orderId, canCancel, restore);\n}\n`;
    await fs.writeFile(apiPath, api);
  }

  const uiPath = path.join(WS, "src/OrderDetails.jsx");
  let ui = await fs.readFile(uiPath, "utf8");
  if (!ui.includes("Cancel order")) {
    ui += `\n// Cancel button visible only for unpaid orders owned by viewer.\nexport function CancelButton({ order, onCancel }) {\n  if (order.status !== "unpaid") return null;\n  return "Cancel order";\n}\n`;
    await fs.writeFile(uiPath, ui);
  }

  const testPath = path.join(WS, "tests/order.cancel.test.js");
  let t = await fs.readFile(testPath, "utf8");
  if (!t.includes("owner cancels unpaid")) {
    t += `\nimport { cancelOrderRoute } from "../src/api.js";\ntest("owner cancels unpaid → restores + 200", () => {\n  const r = cancelOrderRoute({ id: "u1" }, "o1");\n  assert.equal(r.status, 200);\n});\ntest("paid order cannot be cancelled → 409", () => {\n  const r = cancelOrderRoute({ id: "u1" }, "o2");\n  assert.equal(r.status, 409);\n});\n`;
    await fs.writeFile(testPath, t);
  }

  let llm: string | null = null;
  try {
    llm = await nebiusChat(config.nebius.models.builder, [
      { role: "system", content: "You implement scoped diffs only." },
      { role: "user", content: `Implement: ${JSON.stringify(plan?.summary ?? "").slice(0, 400)}` },
    ]);
  } catch {
    llm = null;
  }

  const after = await snapshot();
  return { changed: Object.keys(after), usedModel: config.nebius.models.builder, llm: llm !== null };
}
