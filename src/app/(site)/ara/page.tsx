"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { Metadata } from "next";

type Result = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  publishedAt: string | null;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
        const data = await res.json();
        setResults(data);
        setSearched(true);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <main className="max-w-xl mx-auto px-6 pt-24 pb-32">
      <div className="flex items-center justify-between mb-10">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Ara
        </span>
      </div>

      <div className="relative mb-8">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Yazı başlığı, özet veya etiket..."
          className="w-full bg-transparent border-b border-border/60 pb-3 text-[15px] outline-none placeholder:text-muted-foreground/50 focus:border-primary transition-colors"
        />
        {loading && (
          <span className="absolute right-0 bottom-3 text-xs text-muted-foreground animate-pulse">
            Aranıyor...
          </span>
        )}
      </div>

      {searched && results.length === 0 && (
        <p className="text-[14px] text-muted-foreground">
          &ldquo;{query}&rdquo; için sonuç bulunamadı.
        </p>
      )}

      {results.length > 0 && (
        <div className="divide-y divide-border/50">
          {results.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block py-5">
              <p className="text-[14px] font-medium group-hover:text-primary transition-colors leading-snug mb-1">
                {post.title}
              </p>
              <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed mb-2">
                {post.summary}
              </p>
              {post.tags.length > 0 && (
                <div className="flex gap-1.5">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                      style={{
                        background: "color-mix(in oklch, var(--color-primary) 10%, transparent)",
                        color: "var(--color-primary)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
