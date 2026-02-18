"use client";

import { useCallback, useRef, useState } from "react";
import PromptOutput from "./PromptOutput";
import LoadingState from "./LoadingState";

interface BatchItem {
  id: string;
  prompt: string;
  goals?: string;
  imageData?: string;
  imagePreview?: string;
}

interface BatchResult {
  index: number;
  result?: string;
  error?: string;
}

export default function BatchMode() {
  const [items, setItems] = useState<BatchItem[]>([
    { id: crypto.randomUUID(), prompt: "" },
  ]);
  const [results, setResults] = useState<BatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), prompt: "" },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<BatchItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleImageForItem = useCallback(
    (id: string, file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        updateItem(id, { imageData: dataUrl, imagePreview: dataUrl });
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim());

      const hasHeader =
        lines[0]?.toLowerCase().includes("prompt") ||
        lines[0]?.toLowerCase().includes("idea");
      const dataLines = hasHeader ? lines.slice(1) : lines;

      const newItems: BatchItem[] = dataLines.map((line) => {
        const parts = line.split(",").map((p) => p.trim().replace(/^"|"$/g, ""));
        return {
          id: crypto.randomUUID(),
          prompt: parts[0] || "",
          goals: parts[1] || "",
        };
      });

      if (newItems.length > 0) {
        setItems(newItems.slice(0, 20));
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const canSubmit =
    items.some((item) => item.prompt.trim().length > 0) && !loading;

  const handleGenerate = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setResults([]);

    const validItems = items.filter((item) => item.prompt.trim().length > 0);
    setProgress({ current: 0, total: validItems.length });

    try {
      const batchResults: BatchResult[] = [];

      for (let i = 0; i < validItems.length; i++) {
        const item = validItems[i];
        try {
          const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt: item.prompt.trim(),
              goals: item.goals?.trim() || undefined,
              imageData: item.imageData || undefined,
            }),
          });
          const data = await response.json();
          if (response.ok) {
            batchResults.push({ index: i, result: data.result });
          } else {
            batchResults.push({
              index: i,
              error: data.error || "Generation failed",
            });
          }
        } catch (err: unknown) {
          batchResults.push({
            index: i,
            error: err instanceof Error ? err.message : "Request failed",
          });
        }
        setProgress({ current: i + 1, total: validItems.length });
        setResults([...batchResults]);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="glass rounded-2xl p-6 space-y-5 glow-primary">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
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
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-primary-90">
              Batch Input
            </h2>
            <span className="text-xs text-nv-50 ml-1">
              ({items.length} item{items.length !== 1 ? "s" : ""})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-primary-20/30 text-primary-70 hover:bg-primary-20/50 transition-all cursor-pointer">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Import CSV
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                onChange={handleCSVImport}
                className="hidden"
              />
            </label>
            <button
              onClick={addItem}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-primary-20/30 text-primary-70 hover:bg-primary-20/50 transition-all"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Item
            </button>
          </div>
        </div>

        <p className="text-xs text-nv-50">
          CSV format: each row is{" "}
          <code className="text-primary-60 bg-primary-10/30 px-1 py-0.5 rounded">
            prompt, goals (optional)
          </code>
        </p>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="glass-input rounded-xl p-4 space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary-60">
                  #{idx + 1}
                </span>
                {items.length > 1 && (
                  <button
                    onClick={() => removeItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-nv-50 hover:text-error-80"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
                <div className="space-y-3">
                  <textarea
                    value={item.prompt}
                    onChange={(e) =>
                      updateItem(item.id, { prompt: e.target.value })
                    }
                    placeholder="Video concept..."
                    rows={2}
                    className="w-full rounded-lg bg-surface/50 px-3 py-2.5 text-sm text-nv-90 placeholder-nv-40 resize-none focus:outline-none focus:ring-1 focus:ring-primary-40/50 border border-nv-20/50"
                  />
                  <input
                    value={item.goals || ""}
                    onChange={(e) =>
                      updateItem(item.id, { goals: e.target.value })
                    }
                    placeholder="Goals / constraints (optional)"
                    className="w-full rounded-lg bg-surface/50 px-3 py-2.5 text-sm text-nv-90 placeholder-nv-40 focus:outline-none focus:ring-1 focus:ring-primary-40/50 border border-nv-20/50"
                  />
                </div>

                <div className="flex items-center">
                  {item.imagePreview ? (
                    <div className="relative group/img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={item.imagePreview}
                        alt={`Ref ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <button
                        onClick={() =>
                          updateItem(item.id, {
                            imageData: undefined,
                            imagePreview: undefined,
                          })
                        }
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-error-40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                      >
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                        >
                          <path d="M1 1l10 10M11 1L1 11" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label className="w-20 h-20 rounded-lg border border-dashed border-nv-30 flex flex-col items-center justify-center cursor-pointer hover:border-primary-40/50 transition-colors">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-nv-40"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="3" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                      <span className="text-[10px] text-nv-40 mt-1">
                        Image
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageForItem(item.id, file);
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          ))}
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
              Processing Batch...
            </span>
          ) : (
            `Generate ${items.filter((i) => i.prompt.trim()).length} Prompt${
              items.filter((i) => i.prompt.trim()).length !== 1 ? "s" : ""
            }`
          )}
        </button>
      </div>

      {/* Progress */}
      {loading && progress && (
        <LoadingState
          message={`Processing prompt ${progress.current} of ${progress.total}...`}
          progress={progress}
        />
      )}

      {/* Error */}
      {error && (
        <div className="glass rounded-2xl p-5 border border-error-40/30">
          <p className="text-sm text-error-80">{error}</p>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
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
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-primary-90">
              Generated Prompts
            </h2>
            <span className="text-xs text-nv-50">
              ({results.filter((r) => r.result).length} of {results.length}{" "}
              successful)
            </span>
          </div>

          {results.map((res) => (
            <div key={res.index}>
              {res.result ? (
                <PromptOutput
                  result={res.result}
                  index={res.index}
                  label={`Prompt #${res.index + 1}${
                    items[res.index]?.prompt
                      ? ` — ${items[res.index].prompt.slice(0, 50)}${
                          items[res.index].prompt.length > 50 ? "..." : ""
                        }`
                      : ""
                  }`}
                />
              ) : (
                <div className="glass rounded-xl p-4 border border-error-40/20">
                  <p className="text-xs text-nv-50">
                    Prompt #{res.index + 1}
                  </p>
                  <p className="text-sm text-error-80 mt-1">{res.error}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
