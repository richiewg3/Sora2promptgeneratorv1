"use client";

interface ModeToggleProps {
  mode: "single" | "batch";
  onModeChange: (mode: "single" | "batch") => void;
}

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-xl glass p-1">
      <button
        onClick={() => onModeChange("single")}
        className={`relative px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
          mode === "single"
            ? "bg-primary-30 text-primary-90 shadow-lg shadow-primary-30/20"
            : "text-nv-60 hover:text-nv-80"
        }`}
      >
        Single Mode
      </button>
      <button
        onClick={() => onModeChange("batch")}
        className={`relative px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
          mode === "batch"
            ? "bg-primary-30 text-primary-90 shadow-lg shadow-primary-30/20"
            : "text-nv-60 hover:text-nv-80"
        }`}
      >
        Batch Mode
      </button>
    </div>
  );
}
