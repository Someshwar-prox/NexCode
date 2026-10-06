import { config, isHashed } from "./config";

export type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

// Load-bearing Nebius path. Returns null when keys are placeholders so the
// caller can fall back to the local heuristic and clearly label demo mode.
export async function nebiusChat(model: string, messages: ChatMsg[]): Promise<string | null> {
  if (isHashed(config.nebius.apiKey) || isHashed(model)) return null;
  const res = await fetch(`${config.nebius.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.nebius.apiKey}`,
    },
    body: JSON.stringify({ model, messages, temperature: 0.2, max_tokens: 1500 }),
  });
  if (!res.ok) throw new Error(`Nebius error ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? null;
}
