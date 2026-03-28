import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Değişiklikler",
  description: "Sitede yapılan güncellemeler ve yenilikler.",
};

type Entry = {
  date: string;
  tag: "yeni" | "iyileştirme" | "düzeltme";
  title: string;
  description?: string;
};

const TAG_STYLE: Record<Entry["tag"], { label: string; color: string }> = {
  yeni: { label: "Yeni", color: "oklch(0.60 0.17 46)" },
  iyileştirme: { label: "İyileştirme", color: "oklch(0.55 0.14 260)" },
  düzeltme: { label: "Düzeltme", color: "oklch(0.52 0.12 145)" },
};

const CHANGELOG: Entry[] = [
  {
    date: "28 Mart 2026",
    tag: "yeni",
    title: "Bülten arşivi",
    description: "Geçmiş bültenler /bulten sayfasında listeleniyor.",
  },
  {
    date: "28 Mart 2026",
    tag: "yeni",
    title: "Görüntülenme sayacı",
    description: "Her yazıda kaç kişinin okuduğu gösteriliyor.",
  },
  {
    date: "28 Mart 2026",
    tag: "yeni",
    title: "İlgili yazılar",
    description: "Yazı sonunda aynı etiketlerdeki diğer yazılar öneriliyor.",
  },
  {
    date: "28 Mart 2026",
    tag: "yeni",
    title: "Cmd+K arama",
    description: "Klavye kısayoluyla her yerden arama açılabiliyor.",
  },
  {
    date: "28 Mart 2026",
    tag: "iyileştirme",
    title: "Dock büyütme efekti",
    description: "Dock ikonları imlece yaklaştıkça büyüyor.",
  },
  {
    date: "21 Mart 2026",
    tag: "yeni",
    title: "Blog ve admin paneli",
    description: "Yazı yönetimi, yorumlar, abone yönetimi.",
  },
  {
    date: "21 Mart 2026",
    tag: "yeni",
    title: "Yorum sistemi",
    description: "Her yazıda onaylı yorumlar ve yanıtlar.",
  },
  {
    date: "21 Mart 2026",
    tag: "yeni",
    title: "Hakkımda sayfası",
    description: "Kısa biyografi, teknoloji stack'i ve sosyal linkler.",
  },
  {
    date: "21 Mart 2026",
    tag: "yeni",
    title: "RSS feed",
    description: "/feed.xml adresinde RSS desteği.",
  },
  {
    date: "21 Mart 2026",
    tag: "yeni",
    title: "Bülten aboneliği",
    description: "E-posta ile yeni yazılardan haberdar olma.",
  },
];

export default function ChangelogPage() {
  return (
    <main className="max-w-xl mx-auto px-6 pt-24 pb-32">
      <div className="flex items-center justify-between mb-10">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Değişiklikler
        </span>
      </div>

      <div className="space-y-0">
        {CHANGELOG.map((entry, i) => {
          const tag = TAG_STYLE[entry.tag];
          const showDate = i === 0 || CHANGELOG[i - 1].date !== entry.date;
          return (
            <div key={i}>
              {showDate && (
                <p className="text-xs text-muted-foreground/60 mb-3 mt-8 first:mt-0">
                  {entry.date}
                </p>
              )}
              <div className="flex gap-3 pb-4">
                <span
                  className="mt-0.5 shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full border"
                  style={{
                    color: tag.color,
                    borderColor: `color-mix(in oklch, ${tag.color} 30%, transparent)`,
                    background: `color-mix(in oklch, ${tag.color} 8%, transparent)`,
                  }}
                >
                  {tag.label}
                </span>
                <div>
                  <p className="text-[14px] font-medium leading-snug">{entry.title}</p>
                  {entry.description && (
                    <p className="text-[13px] text-muted-foreground mt-0.5 leading-relaxed">
                      {entry.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
