"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

const NAV_ITEMS = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Yazılar", href: "/blog" },
  { label: "Ben Kimim", href: "/hakkimda" },
];

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

export function Dock() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 26, delay: 0.05 }}
        className="dock-panel flex items-center gap-0.5 px-2 py-1.5"
      >
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors"
              style={{
                color: isActive
                  ? "var(--color-primary)"
                  : "var(--color-muted-foreground)",
                background: isActive
                  ? "color-mix(in oklch, var(--color-primary) 10%, transparent)"
                  : "transparent",
              }}
            >
              {item.label}
            </Link>
          );
        })}

        <div className="w-px mx-1.5 self-stretch my-1 bg-border/80" />

        <button
          onClick={toggle}
          className="p-2 rounded-lg transition-colors"
          style={{ color: "var(--color-muted-foreground)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-foreground)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted-foreground)")}
        >
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>
      </motion.nav>
    </div>
  );
}
