import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#ffffff",
        panel: "#ffffff",
        "panel-hover": "#f1f5f9",
        border: "#e2e8f0",
        "border-bright": "#cbd5e1",
        text: "#0f172a",
        "text-dim": "#475569",
        muted: "#94a3b8",
        accent: "#76b900",
        "accent-strong": "#5c9400",
        "accent-dim": "#e3f3c4",
        success: "#16a34a",
        "success-dim": "#dcfce7",
        warning: "#d97706",
        "warning-dim": "#fef3c7",
        danger: "#dc2626",
        "danger-dim": "#fee2e2",
      },
    },
  },
  plugins: [],
};

export default config;
