import { config } from "./config";
import { nebiusChat } from "./nebius";

export type Plan = {
  summary: string;
  filesToChange: string[];
  filesNotToChange: string[];
  risks: string[];
  testsRequired: string[];
  gates: string[];
  predictedImpact: string[];
  tavilyNeeded: boolean;
  tavilyQuery: string | null;
  usedModel: string;
  llm: boolean;
};

const BASE_PLAN = {
  filesToChange: ["src/api.js", "src/orders.js", "src/OrderDetails.jsx", "tests/order.cancel.test.js"],
  filesNotToChange: ["src/auth.js (policy reused, not rewritten)", "package.json (no new deps)"],
  risks: ["authorization bypass", "inventory double-restore", "paid-order cancel", "transaction safety"],
  testsRequired: ["owner cancels unpaid → 200 + stock restored", "non-owner → 403", "paid order → 409", "already-cancelled → 409"],
  gates: ["node --test tests/", "scope check", "secret scan", "dependency check", "CONTRIBUTING check"],
  predictedImpact: ["OrderDetails page", "cancel API route", "order service", "auth policy (read)", "inventory restore", "backend + frontend tests"],
};

export async function architectPlan(issue: string): Promise<Plan> {
  const tavilyNeeded = /prisma|next\.js|fastapi|migration|version|deprecat|compat|transaction/i.test(issue);
  const tavilyQuery = tavilyNeeded ? `official docs ${issue.slice(0, 80)}` : null;

  const prompt = `You are the Architect for an unfamiliar repo. Issue: ${issue}. Reply with a 6-line scoped plan: scope, non-scope, risks, tests, gates, impact.`;
  let llmText: string | null = null;
  try {
    llmText = await nebiusChat(config.nebius.models.architect, [
      { role: "system", content: "You plan safe contributions. Be scoped and risk-aware." },
      { role: "user", content: prompt },
    ]);
  } catch {
    llmText = null;
  }

  return {
    summary: llmText?.slice(0, 600) ?? `Cancel unpaid orders from Order Details. Owner-only, unpaid-only, restore inventory, cover with tests.`,
    ...BASE_PLAN,
    tavilyNeeded,
    tavilyQuery,
    usedModel: config.nebius.models.architect,
    llm: llmText !== null,
  };
}
