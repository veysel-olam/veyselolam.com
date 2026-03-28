"use client";

import { useState } from "react";

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Kopyalandı" : "Kopyala"}
      className="absolute right-3 top-3 flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-all opacity-0 group-hover:opacity-100"
      style={{
        background: copied
          ? "color-mix(in oklch, var(--color-primary) 15%, transparent)"
          : "oklch(1 0 0 / 8%)",
        color: copied ? "var(--color-primary)" : "oklch(1 0 0 / 60%)",
      }}
    >
      {copied ? (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Kopyalandı
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          Kopyala
        </>
      )}
    </button>
  );
}
