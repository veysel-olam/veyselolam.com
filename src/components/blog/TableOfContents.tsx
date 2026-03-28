"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/mdx";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const clicking = useRef(false);

  useEffect(() => {
    const headings = items
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const onScroll = () => {
      // Tıklama sonrası kısa bir süre scroll listener'ı devre dışı bırak
      if (clicking.current) return;

      const scrollY = window.scrollY;
      const offset = 80; // viewport üstünden bu kadar aşağısındakiler "aktif" kabul edilir

      // Offset'in altında kalan başlıklar arasında en sona olanı seç
      let current = "";
      for (const el of headings) {
        if (el.getBoundingClientRect().top + scrollY <= scrollY + offset) {
          current = el.id;
        }
      }

      setActiveId(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-20">
      <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60 mb-4 pl-3">
        İçindekiler
      </p>
      <ul className="space-y-0">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(item.id);
                  if (!el) return;
                  clicking.current = true;
                  setActiveId(item.id);
                  const top = el.getBoundingClientRect().top + window.scrollY - 20;
                  window.scrollTo({ top, behavior: "smooth" });
                  setTimeout(() => { clicking.current = false; }, 800);
                }}
                className={cn(
                  "flex items-stretch gap-0 py-1 text-[12px] leading-snug transition-all",
                  isActive ? "text-foreground" : "text-muted-foreground/70 hover:text-muted-foreground"
                )}
                style={{ paddingLeft: `${(item.level - 1) * 10}px` }}
              >
                <span
                  className="w-px mr-3 shrink-0 rounded-full transition-colors"
                  style={{
                    background: isActive
                      ? "var(--color-primary)"
                      : "var(--color-border)",
                  }}
                />
                <span className={cn("py-0.5", isActive && "font-medium")}>
                  {item.text}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
