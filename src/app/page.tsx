"use client";

import { useState } from "react";
import ModeToggle from "@/components/ModeToggle";
import SingleMode from "@/components/SingleMode";
import BatchMode from "@/components/BatchMode";

export default function Home() {
  const [mode, setMode] = useState<"single" | "batch">("single");

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary-20/8 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary-15/10 blur-[100px]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-primary-30/5 blur-[80px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(184, 195, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(184, 195, 255, 0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <header className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-primary-70 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-60 animate-pulse-glow" />
            Prompt Engineering Middleware
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            <span className="gradient-text">Sora</span>
            <span className="text-primary-95">Pro</span>
          </h1>

          <p className="text-sm sm:text-base text-nv-60 max-w-xl mx-auto leading-relaxed">
            Transform reference images and text ideas into production-ready Sora
            2 video prompts with professional cinematographic language.
          </p>

          <div className="mt-7 flex justify-center">
            <ModeToggle mode={mode} onModeChange={setMode} />
          </div>
        </header>

        {/* Content */}
        <main>
          {mode === "single" ? <SingleMode /> : <BatchMode />}
        </main>

        {/* Footer accent */}
        <footer className="mt-16 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs text-nv-35">
            <span className="w-1 h-1 rounded-full bg-primary-30" />
            Powered by Vercel AI Gateway
          </div>
        </footer>
      </div>
    </div>
  );
}
