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
      <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-3">
        İçindekiler
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 10}px` }}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(item.id);
                if (!el) return;

                // Tıklama sırasında scroll listener'ı geçici olarak sustur
                clicking.current = true;
                setActiveId(item.id);

                const top = el.getBoundingClientRect().top + window.scrollY - 20;
                window.scrollTo({ top, behavior: "smooth" });

                setTimeout(() => { clicking.current = false; }, 800);
              }}
              className={cn(
                "block py-1 text-[13px] leading-snug transition-colors hover:text-foreground",
                activeId === item.id
                  ? "font-medium"
                  : "text-muted-foreground"
              )}
              style={activeId === item.id ? { color: "var(--color-primary)" } : {}}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
