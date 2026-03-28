"use client";

import { useState, useEffect, useCallback } from "react";
import { Dock } from "./Dock";
import { SearchModal } from "./SearchModal";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {children}
      <Dock onSearchOpen={openSearch} />
      <SearchModal open={searchOpen} onClose={closeSearch} />
    </div>
  );
}
