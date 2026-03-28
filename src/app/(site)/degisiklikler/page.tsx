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

const TAG: Record<Entry["tag"], { label: string }> = {
  yeni:         { label: "Yeni" },
  iyileştirme:  { label: "İyileştirme" },
  düzeltme:     { label: "Düzeltme" },
};

const CHANGELOG: Entry[] = [
  { date: "28 Mart 2026", tag: "yeni",        title: "Bülten arşivi",       description: "Geçmiş bültenler /bulten adresinde listeleniyor." },
  { date: "28 Mart 2026", tag: "yeni",        title: "Görüntülenme sayacı", description: "Yazı başlığının yanında okuma sayısı gösteriliyor." },
  { date: "28 Mart 2026", tag: "yeni",        title: "İlgili yazılar",      description: "Aynı etiketlerdeki diğer yazılar içerik sonunda öneriliyor." },
  { date: "28 Mart 2026", tag: "yeni",        title: "⌘K arama",            description: "Klavye kısayoluyla her yerden arama açılabiliyor." },
  { date: "28 Mart 2026", tag: "yeni",        title: "Yazı içi görsel",     description: "Admin panelinde MDX içine doğrudan görsel yüklenebiliyor." },
  { date: "28 Mart 2026", tag: "iyileştirme", title: "İçindekiler",         description: "Aktif bölümü gösteren dikey çizgi göstergesi eklendi." },
  { date: "21 Mart 2026", tag: "yeni",        title: "Blog",                description: "Yazı listesi, yazı detayı, etiketler, okuma süresi." },
  { date: "21 Mart 2026", tag: "yeni",        title: "Admin paneli",        description: "Yazı yönetimi, yorum onaylama, abone listesi." },
  { date: "21 Mart 2026", tag: "yeni",        title: "Yorum sistemi",       description: "Her yazıda onaylı yorumlar ve iç içe yanıtlar." },
  { date: "21 Mart 2026", tag: "yeni",        title: "Hakkımda",            description: "Biyografi, teknoloji stack'i ve sosyal linkler." },
  { date: "21 Mart 2026", tag: "yeni",        title: "RSS ve Sitemap",      description: "/feed.xml ve otomatik sitemap desteği." },
  { date: "21 Mart 2026", tag: "yeni",        title: "Bülten aboneliği",    description: "E-posta ile yeni yazılardan haberdar olma." },
];

function tagColor(tag: Entry["tag"]) {
  if (tag === "yeni") return "var(--color-primary)";
  if (tag === "iyileştirme") return "oklch(0.55 0.14 260)";
  return "oklch(0.52 0.12 145)";
}

// Girişleri tarihe göre grupla
function group(entries: Entry[]) {
  const map: { date: string; entries: Entry[] }[] = [];
  for (const e of entries) {
    const last = map.at(-1);
    if (last && last.date === e.date) last.entries.push(e);
    else map.push({ date: e.date, entries: [e] });
  }
  return map;
}

export default function ChangelogPage() {
  const groups = group(CHANGELOG);

  return (
    <main className="max-w-xl mx-auto px-6 pt-24 pb-32">
      <div className="mb-10">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Değişiklikler
        </span>
      </div>

      <div className="space-y-10">
        {groups.map(({ date, entries }) => (
          <div key={date} className="grid grid-cols-[80px_1fr] gap-x-6 sm:grid-cols-[100px_1fr]">
            {/* Tarih */}
            <div className="pt-0.5">
              <p className="text-[11px] text-muted-foreground/60 leading-snug">{date}</p>
            </div>

            {/* Maddeler */}
            <div className="space-y-4 border-l border-border/50 pl-6 relative">
              {entries.map((entry, i) => (
                <div key={i} className="relative">
                  {/* Nokta */}
                  <span
                    className="absolute -left-[25px] top-[5px] w-1.5 h-1.5 rounded-full"
                    style={{ background: tagColor(entry.tag) }}
                  />
                  <div className="flex items-start gap-2">
                    <span
                      className="shrink-0 mt-0.5 text-[10px] font-medium"
                      style={{ color: tagColor(entry.tag) }}
                    >
                      {TAG[entry.tag].label}
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
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
