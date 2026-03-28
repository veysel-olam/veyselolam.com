import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Sayfa Bulunamadı",
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-sm w-full">
        <div className="mb-8 font-mono text-[12px] text-muted-foreground select-none space-y-1">
          <div className="flex items-center gap-2">
            <span>~/veyselolam</span>
            <span style={{ color: "var(--color-primary)" }}>$</span>
            <span className="opacity-60">cd .</span>
          </div>
          <p className="opacity-40 pl-0">bash: .: No such file or directory</p>
        </div>

        <p className="text-[15px] text-muted-foreground leading-relaxed mb-8">
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
