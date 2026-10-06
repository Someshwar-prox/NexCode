export function runtimeFlow() {
  return {
    journey: "Cancel unpaid order from Order Details",
    before: ["open OrderDetails", "no cancel action", "support ticket needed"],
    after: [
      "click Cancel on OrderDetails",
      "OrderDetails → cancelOrderRoute",
      "auth.canCancel → allow (owner)",
      "orders.cancelOrder → status check unpaid",
      "inventory.restore → stock += qty",
      "200 → UI shows cancelled",
    ],
    branches: [
      { when: "non-owner", result: "403 forbidden" },
      { when: "paid order", result: "409 not_cancellable" },
    ],
    source: "derived from sandbox test run + static wiring in src/api.js",
  };
}
