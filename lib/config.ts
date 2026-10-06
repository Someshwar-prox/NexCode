export const isHashed = (v: string | undefined) =>
  !v || v.startsWith("HASHED") || v === "REPLACE_ME";

export const config = {
  nebius: {
    apiKey: process.env.NEBIUS_API_KEY ?? "HASHED_REPLACE_ME",
    baseUrl: process.env.NEBIUS_BASE_URL ?? "https://api.studio.nebius.com/v1",
    models: {
      architect: process.env.NEBIUS_MODEL_ARCHITECT ?? "HASHED_NVIDIA_REASONING_MODEL",
      builder: process.env.NEBIUS_MODEL_BUILDER ?? "HASHED_NVIDIA_CODE_MODEL",
      verifier: process.env.NEBIUS_MODEL_VERIFIER ?? "HASHED_NVIDIA_REVIEW_MODEL",
      fast: process.env.NEBIUS_MODEL_FAST ?? "HASHED_NVIDIA_FAST_MODEL",
    },
  },
  tavily: {
    apiKey: process.env.TAVILY_API_KEY ?? "HASHED_REPLACE_ME",
    maxCallsPerTask: Number(process.env.TAVILY_MAX_CALLS_PER_TASK ?? 3),
  },
  sandboxMode: process.env.SANDBOX_MODE ?? "local",
};

export function modelStatus() {
  return {
    provider: "nebius",
    sandboxMode: config.sandboxMode,
    nebiusConfigured: !isHashed(config.nebius.apiKey),
    tavilyConfigured: !isHashed(config.tavily.apiKey),
    routing: [
      { agent: "architect", model: config.nebius.models.architect, role: "planning / reasoning" },
      { agent: "builder", model: config.nebius.models.builder, role: "code generation" },
      { agent: "verifier", model: config.nebius.models.verifier, role: "review / security" },
      { agent: "utility", model: config.nebius.models.fast, role: "summaries / logs" },
    ],
  };
}
