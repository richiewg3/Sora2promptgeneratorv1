"use client";

import { useState } from "react";

interface PromptOutputProps {
  result: string;
  index?: number;
  label?: string;
}

export default function PromptOutput({ result, index, label }: PromptOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayLabel = label || (index !== undefined ? `Prompt #${index + 1}` : "Enhanced Video Prompt");

  return (
    <div className="glass-strong rounded-2xl overflow-hidden gradient-border">
      <div className="flex items-center justify-between px-5 py-3 border-b border-primary-20/20">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-primary-60 animate-pulse-glow" />
          <h3 className="text-sm font-semibold text-primary-80">
            {displayLabel}
          </h3>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 bg-primary-20/30 text-primary-70 hover:bg-primary-20/50 hover:text-primary-80"
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <div className="p-5 max-h-[600px] overflow-y-auto">
        <pre className="whitespace-pre-wrap text-sm leading-relaxed text-nv-80 font-sans">
          {result}
        </pre>
      </div>
    </div>
  );
}
