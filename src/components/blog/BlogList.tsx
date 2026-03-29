"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDateShort } from "@/lib/utils";

type PostWithReadingTime = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: Date | null;
  readingTime: string | null;
  tags: string[];
};

type PostFromApi = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string | null;
  readingTime?: string | null;
  tags: string[];
};

type DisplayPost = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: Date | string | null;
  readingTime?: string | null;
  tags: string[];
};

export function BlogList({ posts }: { posts: PostWithReadingTime[] }) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PostFromApi[] | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSearchResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch {
        // ignore fetch errors
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const filtered: DisplayPost[] = searchResults !== null
    ? searchResults
    : query.trim()
      ? posts.filter(
          (p) =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.summary.toLowerCase().includes(query.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
        )
      : posts;

  return (
    <>
      <div className="flex items-center justify-between mb-10">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Yazılar
        </span>
        <div className="flex items-center gap-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ara…"
            className="text-xs bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground/50 w-24 focus:w-36 transition-all duration-200"
          />
          {searching && (
            <span className="text-xs text-muted-foreground/50">...</span>
          )}
          {posts.length > 0 && !searching && (
            <span className="text-xs text-muted-foreground tabular-nums shrink-0">
              {filtered.length} yazı
            </span>
          )}
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground text-[15px]">Henüz yayınlanmış yazı yok.</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground text-[15px]">Sonuç bulunamadı.</p>
      ) : (
        <div className="divide-y divide-border/50">
          {filtered.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block py-7">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h2 className="text-[15px] font-medium leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                {post.publishedAt && (
                  <span className="text-xs text-muted-foreground tabular-nums shrink-0 mt-0.5">
                    {formatDateShort(post.publishedAt)}
                  </span>
                )}
              </div>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-3">
                {post.summary}
              </p>
              <div className="flex items-center gap-2">
                {post.readingTime && (
                  <span className="text-xs text-muted-foreground">{post.readingTime}</span>
                )}
                {post.readingTime && post.tags.length > 0 && (
                  <span className="text-muted-foreground/40 text-xs">·</span>
                )}
                {post.tags.length > 0 && (
                  <div className="flex gap-1.5">
                    {post.tags.map((t) => (
                      <Link
                        key={t}
                        href={`/blog/etiket/${encodeURIComponent(t)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-2 py-0.5 rounded-full text-[11px] font-medium transition-opacity hover:opacity-70"
                        style={{
                          background: "color-mix(in oklch, var(--color-primary) 10%, transparent)",
                          color: "var(--color-primary)",
                        }}
                      >
                        {t}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
