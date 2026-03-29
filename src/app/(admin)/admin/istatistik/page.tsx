import { prisma } from "@/lib/prisma";
import { formatDateShort } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const [posts, subscriberCount] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { views: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
        publishedAt: true,
        readingTime: true,
        _count: { select: { likes: true, comments: true } },
      },
    }),
    prisma.subscriber.count({ where: { confirmed: true } }),
  ]);

  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);
  const totalLikes = posts.reduce((sum, p) => sum + p._count.likes, 0);
  const totalComments = posts.reduce((sum, p) => sum + p._count.comments, 0);

  const maxViews = Math.max(...posts.map((p) => p.views), 1);

  return (
    <div className="space-y-10">
      <h1 className="text-xl font-semibold tracking-tight">İstatistik</h1>

      {/* Özet kartlar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Toplam Görüntülenme", value: totalViews.toLocaleString("tr-TR") },
          { label: "Toplam Beğeni", value: totalLikes.toLocaleString("tr-TR") },
          { label: "Toplam Yorum", value: totalComments.toLocaleString("tr-TR") },
          { label: "Abone", value: subscriberCount.toLocaleString("tr-TR") },
        ].map(({ label, value }) => (
          <div key={label} className="border border-border/60 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl font-semibold tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      {/* Yazı bazında */}
      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">Henüz yayınlanmış yazı yok.</p>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Yazılar — görüntülenmeye göre
          </p>
          <div className="divide-y divide-border/50">
            {posts.map((post) => {
              const barWidth = Math.max((post.views / maxViews) * 100, 2);
              return (
                <div key={post.id} className="py-4 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{post.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {post.publishedAt && formatDateShort(post.publishedAt)}
                        {post.readingTime && ` · ${post.readingTime}`}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-medium tabular-nums">
                        {post.views.toLocaleString("tr-TR")}
                      </p>
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {post._count.likes} ♥ · {post._count.comments} yorum
                      </p>
                    </div>
                  </div>
                  {/* Bar */}
                  <div className="h-1 rounded-full bg-border/40 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${barWidth}%`,
                        background: "var(--color-primary)",
                        opacity: 0.7,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
