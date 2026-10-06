export const SKILLS = [
  {
    id: "nextjs-route-builder",
    purpose: "Build Next.js App Router routes following existing conventions",
    allowedPaths: ["src/app/**", "src/components/**"],
    rules: ["Use async server components by default", "Validate input with zod", "Return typed error JSON"],
    gates: ["tsc --noEmit passes", "route covered by test"],
  },
  {
    id: "order-service-rules",
    purpose: "Enforce order state + inventory consistency",
    allowedPaths: ["src/orders.*", "src/inventory.*", "src/api.*"],
    rules: [
      "Only the order owner can cancel",
      "Only unpaid orders can be cancelled",
      "Cancellation restores inventory in the same transaction",
      "Paid / shipped orders are never auto-cancelled",
    ],
    gates: ["order.cancel tests pass", "no protected module touched"],
  },
  {
    id: "contribution-checker",
    purpose: "Enforce CONTRIBUTING.md for maintainer-ready patches",
    allowedPaths: ["**"],
    rules: ["No direct push to main", "No new dependencies without plan approval", "No secrets in diff"],
    gates: ["scope check", "secret scan", "dependency check"],
  },
];
