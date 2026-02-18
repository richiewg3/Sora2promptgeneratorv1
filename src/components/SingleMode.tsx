"use client";

import { useState } from "react";
import ImageUpload from "./ImageUpload";
import PromptOutput from "./PromptOutput";
import LoadingState from "./LoadingState";

export default function SingleMode() {
  const [imageData, setImageData] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [goals, setGoals] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = prompt.trim().length > 0 && !loading;

  const handleGenerate = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          goals: goals.trim() || undefined,
          imageData: imageData || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }
      setResult(data.result);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <div className="space-y-5">
        <div className="glass rounded-2xl p-6 space-y-5 glow-primary">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary-20/40 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-primary-60"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-primary-90">
              Input
            </h2>
          </div>

          <ImageUpload onImageSelect={setImageData} preview={imageData} />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-nv-70">
              Video Concept <span className="text-error-80">*</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your initial video concept... e.g., 'A woman walking through a neon-lit city at night, looking up at the rain'"
              rows={4}
              className="w-full rounded-xl glass-input px-4 py-3 text-sm text-nv-90 placeholder-nv-40 resize-none focus:outline-none focus:ring-1 focus:ring-primary-40/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-nv-70">
              Additional Goals{" "}
              <span className="text-nv-40 font-normal">(optional)</span>
            </label>
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="Any specific constraints, styles, or technical requirements... e.g., 'Make it look like a 35mm film with shallow depth of field'"
              rows={3}
              className="w-full rounded-xl glass-input px-4 py-3 text-sm text-nv-90 placeholder-nv-40 resize-none focus:outline-none focus:ring-1 focus:ring-primary-40/50 transition-all"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!canSubmit}
            className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              canSubmit
                ? "bg-gradient-to-r from-primary-30 to-primary-40 text-primary-95 hover:from-primary-35 hover:to-primary-50 shadow-lg shadow-primary-30/20 hover:shadow-primary-40/30 active:scale-[0.98]"
                : "bg-nv-20 text-nv-40 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Generating...
              </span>
            ) : (
              "Generate Video Prompt"
            )}
          </button>
        </div>
      </div>

      {/* Output Section */}
      <div className="space-y-5">
        {loading && <LoadingState />}

        {error && (
          <div className="glass rounded-2xl p-5 border border-error-40/30">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-error-40/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-error-80"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-error-80">
                  Generation Failed
                </p>
                <p className="text-xs text-nv-60 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {result && <PromptOutput result={result} />}

        {!loading && !result && !error && (
          <div className="glass rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
            <div className="w-16 h-16 rounded-2xl bg-primary-10/30 flex items-center justify-center mb-4 animate-float">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-primary-50"
              >
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
            <p className="text-sm text-nv-50 max-w-xs">
              Upload a reference image and describe your video concept to
              generate a production-ready Sora 2 prompt.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
