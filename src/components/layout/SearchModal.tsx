"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Result = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
};

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSearched(false);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        setResults(await res.json());
        setSearched(true);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[60]"
            style={{ background: "oklch(0 0 0 / 40%)" }}
            onClick={onClose}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed left-1/2 top-[20vh] z-[61] w-full max-w-lg -translate-x-1/2 px-4"
          >
            <div
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: "var(--color-background)", border: "1px solid var(--color-border)" }}
            >
              {/* Input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/60">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 shrink-0 text-muted-foreground">
                  <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Yazılarda ara..."
                  className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground/50"
                />
                {loading && (
                  <span className="text-xs text-muted-foreground animate-pulse">...</span>
                )}
                <kbd className="text-[11px] text-muted-foreground/50 border border-border/40 rounded px-1.5 py-0.5">
                  esc
                </kbd>
              </div>

              {/* Results */}
              {(results.length > 0 || (searched && results.length === 0)) && (
                <div className="max-h-72 overflow-y-auto py-2">
                  {results.length === 0 ? (
                    <p className="px-4 py-3 text-[13px] text-muted-foreground">
                      &ldquo;{query}&rdquo; için sonuç bulunamadı.
                    </p>
                  ) : (
                    results.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        onClick={onClose}
                        className="flex flex-col gap-0.5 px-4 py-2.5 hover:bg-muted/50 transition-colors"
                      >
                        <span className="text-[13px] font-medium leading-snug">{post.title}</span>
                        <span className="text-[12px] text-muted-foreground line-clamp-1 leading-relaxed">
                          {post.summary}
                        </span>
                        {post.tags.length > 0 && (
                          <div className="flex gap-1 mt-0.5">
                            {post.tags.slice(0, 3).map((t) => (
                              <span key={t} className="text-[10px] text-muted-foreground/60">{t}</span>
                            ))}
                          </div>
                        )}
                      </Link>
                    ))
                  )}
                </div>
              )}

              {!searched && query.length === 0 && (
                <div className="px-4 py-3">
                  <p className="text-[12px] text-muted-foreground/50">Aramak için yazmaya başla</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
