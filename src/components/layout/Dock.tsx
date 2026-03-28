"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { useRef } from "react";
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

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

function DockIcon({
  mouseX,
  children,
  label,
  isActive,
  onClick,
  href,
}: {
  mouseX: ReturnType<typeof useMotionValue<number>>;
  children: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  href?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const distance = useTransform(mouseX, (val) => {
    const el = ref.current;
    if (!el) return Infinity;
    const rect = el.getBoundingClientRect();
    return val - (rect.left + rect.width / 2);
  });

  const scaleRaw = useTransform(distance, [-60, 0, 60], [1, reduced ? 1 : 1.22, 1]);
  const scale = useSpring(scaleRaw, { stiffness: 320, damping: 28, mass: 0.5 });

  const color = isActive ? "var(--color-primary)" : "var(--color-muted-foreground)";
  const bg = isActive
    ? "color-mix(in oklch, var(--color-primary) 12%, transparent)"
    : "transparent";

  const content = (
    <motion.div
      ref={ref}
      style={{ scale }}
      className="relative flex flex-col items-center"
      title={label}
    >
      <div
        className="p-2 rounded-lg transition-colors"
        style={{ color, background: bg }}
      >
        {children}
      </div>
      {isActive && (
        <span
          className="absolute -bottom-1.5 w-1 h-1 rounded-full"
          style={{ background: "var(--color-primary)" }}
        />
      )}
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} aria-label={label} className="outline-none">
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} aria-label={label} className="outline-none">
      {content}
    </button>
  );
}

export function Dock({ onSearchOpen }: { onSearchOpen?: () => void }) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 26, delay: 0.05 }}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="dock-panel flex items-end gap-0.5 px-2 py-2"
      >
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <DockIcon
              key={item.href}
              mouseX={mouseX}
              href={item.href}
              label={item.label}
              isActive={isActive}
            >
              {item.icon}
            </DockIcon>
          );
        })}

        <div className="w-px mx-1 self-stretch my-1 bg-border/70" />

        <DockIcon mouseX={mouseX} label="Ara (⌘K)" onClick={onSearchOpen}>
          <SearchIcon />
        </DockIcon>

        <DockIcon
          mouseX={mouseX}
          label={theme === "light" ? "Karanlık mod" : "Aydınlık mod"}
          onClick={toggle}
        >
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </DockIcon>
      </motion.nav>
    </div>
  );
}
