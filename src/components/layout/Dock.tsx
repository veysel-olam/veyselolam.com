"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

const NAV_ITEMS = [
  {
    label: "Ana Sayfa",
    href: "/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    label: "Yazılar",
    href: "/blog",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <path d="M12 20h9" />
        <path d="M16.376 3.622a1 1 0 013.002 3.002L7.368 18.635a2 2 0 01-.855.506l-2.872.808a.5.5 0 01-.62-.62l.808-2.872a2 2 0 01.506-.854z" />
      </svg>
    ),
  },
  {
    label: "Ben Kimim",
    href: "/hakkimda",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
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
        className="dock-panel flex items-center gap-0.5 px-2 py-2"
      >
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className="p-2 rounded-lg transition-colors"
              style={{
                color: isActive
                  ? "var(--color-primary)"
                  : "var(--color-muted-foreground)",
                background: isActive
                  ? "color-mix(in oklch, var(--color-primary) 12%, transparent)"
                  : "transparent",
              }}
            >
              {item.icon}
            </Link>
          );
        })}

        <div className="w-px mx-1 self-stretch my-0.5 bg-border/70" />

        <button
          onClick={toggle}
          title={theme === "light" ? "Karanlık mod" : "Aydınlık mod"}
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
