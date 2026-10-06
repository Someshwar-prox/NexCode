import { config, isHashed } from "./config";

export type TavilyHit = {
  title: string;
  url: string;
  content: string;
  score: number;
};

const OFFICIAL = [
  "nextjs.org",
  "react.dev",
  "fastapi.tiangolo.com",
  "prisma.io",
  "docs.python.org",
  "nodejs.org",
  "tailwindcss.com",
];

// Tavily is only called when local repo context is insufficient. Every call
// is budgeted and the chosen source must be cited in the plan.
export async function tavilySearch(query: string, maxResults = 4): Promise<{
  configured: boolean;
  hits: TavilyHit[];
  note: string;
}> {
  if (isHashed(config.tavily.apiKey)) {
    return {
      configured: false,
      hits: [],
      note: "TAVILY_API_KEY is HASHED — skipped live search. Plug a key to enable official-docs lookup.",
    };
  }
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: config.tavily.apiKey,
      query,
      search_depth: "advanced",
      max_results: maxResults,
      include_domains: OFFICIAL,
    }),
  });
  if (!res.ok) throw new Error(`Tavily error ${res.status}`);
  const json = await res.json();
  return {
    configured: true,
    hits: (json.results ?? []).map((r: any) => ({
      title: r.title,
      url: r.url,
      content: (r.content ?? "").slice(0, 1200),
      score: r.score ?? 0,
    })),
    note: "Official-domain filtered.",
  };
}
