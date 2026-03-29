"use client";

import { useEffect } from "react";
import { useReadingHistory } from "./ReadingHistory";

export function HistoryTracker({ slug, title }: { slug: string; title: string }) {
  const { addToHistory } = useReadingHistory();
  useEffect(() => {
    addToHistory(slug, title);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);
  return null;
}
