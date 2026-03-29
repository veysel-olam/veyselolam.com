"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type HistoryItem = { slug: string; title: string; readAt: number };
const HISTORY_KEY = "reading_history";
const MAX_ITEMS = 10;

export function useReadingHistory() {
  const getHistory = (): HistoryItem[] => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]"); } catch { return []; }
  };

  const addToHistory = (slug: string, title: string) => {
    const history = getHistory().filter(h => h.slug !== slug);
    history.unshift({ slug, title, readAt: Date.now() });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_ITEMS)));
  };

  return { getHistory, addToHistory };
}

export function ReadingHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { getHistory } = useReadingHistory();

  useEffect(() => {
    setHistory(getHistory());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (history.length === 0) return null;

  return (
    <div className="mt-10 pt-8 border-t border-border/60">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
        Geçmiş
      </p>
      <div className="space-y-2">
        {history.slice(0, 5).map(item => (
          <Link key={item.slug} href={`/blog/${item.slug}`}
            className="block text-[13px] text-muted-foreground hover:text-foreground transition-colors truncate">
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
