"use client";

import { useCallback, useRef, useState } from "react";

interface ImageUploadProps {
  onImageSelect: (dataUrl: string | null) => void;
  preview: string | null;
  label?: string;
}

export default function ImageUpload({
  onImageSelect,
  preview,
  label = "Reference Image",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageSelect(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-nv-70">{label}</label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl glass-input transition-all duration-300 overflow-hidden ${
          isDragging
            ? "border-primary-60 bg-primary-10/20"
            : "hover:border-primary-40/30"
        } ${preview ? "p-2" : "p-8"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        {preview ? (
          <div className="relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Reference"
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <span className="text-sm text-white/80">Click to replace</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onImageSelect(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-error-40 transition-all"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 1l10 10M11 1L1 11" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary-20/40 flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-primary-60"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-nv-70">
                Drop an image here or{" "}
                <span className="text-primary-70 font-medium">browse</span>
              </p>
              <p className="text-xs text-nv-50 mt-1">
                JPEG, PNG, or WebP
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
