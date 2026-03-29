import Link from "next/link";
import { SignOutButton } from "@/components/admin/SignOutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border/60">
        <div className="max-w-4xl mx-auto px-6 h-12 flex items-center justify-between">
          <nav className="flex items-center gap-6">
            <Link href="/admin/posts" className="text-sm font-medium hover:text-primary transition-colors">
              Yazılar
            </Link>
            <Link href="/admin/comments" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Yorumlar
            </Link>
            <Link href="/admin/bulten" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Bülten
            </Link>
            <Link href="/admin/istatistik" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              İstatistik
            </Link>
            <Link href="/admin/hakkimda" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Hakkımda
            </Link>
          </nav>
          <SignOutButton />
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
