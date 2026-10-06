import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexCode — Visual AI Contribution Agent",
  description: "Visual AI contribution agent for unfamiliar codebases. Built for the Nebius × NVIDIA Global AI Hackathon.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col text-slate-900 selection:bg-[#76b900]/20 selection:text-slate-900">
        {children}
      </body>
    </html>
  );
}
