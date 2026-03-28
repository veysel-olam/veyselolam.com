import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Sayfa Bulunamadı",
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div>
        <div className="mb-8 flex items-center gap-2 font-mono text-[13px] text-muted-foreground select-none">
          <span>~/veyselolam</span>
          <span style={{ color: "var(--color-primary)" }}>$</span>
          <span className="opacity-60">cd .</span>
          <span className="opacity-40 ml-1">bash: .: No such file or directory</span>
        </div>

        <p className="text-[15px] text-muted-foreground leading-relaxed mb-8 max-w-xs">
          Aradığın sayfa burada değil. Taşınmış ya da hiç var olmamış olabilir.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] font-medium transition-colors"
          style={{ color: "var(--color-primary)" }}
        >
          ← Ana sayfaya dön
        </Link>
      </div>
    </main>
  );
}
