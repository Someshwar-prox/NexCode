export const DEMO_FILES: Record<string, string> = {
  "README.md": `# Demo Shop — orders

Small full-stack demo for NexCode. Baseline has NO cancel-order flow.
Task: allow users to cancel unpaid orders from Order Details. Owner-only.
Cancellation must restore inventory. Add frontend + backend tests.
`,
  "CONTRIBUTING.md": `# Contributing
- Never push to main. Use branches.
- No new dependencies without approval.
- Run tests + lint before PR.
- No secrets in code.
`,
  "package.json": JSON.stringify(
    { name: "demo-shop", version: "1.0.0", type: "module", scripts: { test: "node --test tests/*.test.js" } },
    null,
    2
  ),
  "src/orders.js": `export const orders = new Map([
  ["o1", { id: "o1", ownerId: "u1", status: "unpaid", items: [{ sku: "book", qty: 1 }] }],
  ["o2", { id: "o2", ownerId: "u1", status: "paid", items: [{ sku: "pen", qty: 2 }] }],
]);

export function getOrder(id) {
  return orders.get(id) ?? null;
}
`,
  "src/auth.js": `export function canCancel(user, order) {
  if (!user || !order) return false;
  return user.id === order.ownerId;
}
`,
  "src/inventory.js": `export const stock = new Map([["book", 4], ["pen", 10]]);

export function restore(items) {
  for (const it of items) stock.set(it.sku, (stock.get(it.sku) ?? 0) + it.qty);
}
`,
  "src/api.js": `import { getOrder } from "./orders.js";
import { canCancel } from "./auth.js";

export function getOrderDetails(user, orderId) {
  const order = getOrder(orderId);
  if (!order) return { status: 404, body: { error: "not_found" } };
  if (!canCancel(user, order)) return { status: 403, body: { error: "forbidden" } };
  return { status: 200, body: { order } };
}
`,
  "src/OrderDetails.jsx": `// Placeholder component — cancel button added by Builder.
export function OrderDetails({ order }) {
  return "Order " + order.id + " status=" + order.status;
}
`,
  "tests/order.cancel.test.js": `import test from "node:test";
import assert from "node:assert/strict";
import { getOrderDetails } from "../src/api.js";

test("non-owner cannot read order", () => {
  const r = getOrderDetails({ id: "u2" }, "o1");
  assert.equal(r.status, 403);
});
`,
};
