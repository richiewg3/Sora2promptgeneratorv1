"use client";

interface LoadingStateProps {
  message?: string;
  progress?: { current: number; total: number };
}

export default function LoadingState({ message, progress }: LoadingStateProps) {
  return (
    <div className="glass-strong rounded-2xl p-8 gradient-border">
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-primary-20/30" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-60 animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-primary-40 animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary-60 animate-pulse-glow" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-primary-80">
            {message || "Analyzing & generating..."}
          </p>
          {progress && (
            <div className="space-y-1.5">
              <div className="w-48 h-1.5 bg-primary-10/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-50 to-primary-70 rounded-full transition-all duration-500"
                  style={{
                    width: `${(progress.current / progress.total) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-nv-50">
                {progress.current} of {progress.total} complete
              </p>
            </div>
          )}
          <p className="text-xs text-nv-50">
            Extracting visual details and crafting cinematographic language...
          </p>
        </div>
      </div>
    </div>
  );
}
