import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateShort } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: {
      slug: true,
      title: true,
      summary: true,
      publishedAt: true,
      readingTime: true,
      tags: true,
    },
  });

  return (
    <main className="max-w-xl mx-auto px-6 pt-24 pb-32">
      <div className="flex items-center justify-between mb-10">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Yazılar
        </span>
        {posts.length > 0 && (
          <span className="text-xs text-muted-foreground">{posts.length} yazı</span>
        )}
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground text-[15px]">Henüz yayınlanmış yazı yok.</p>
      ) : (
        <div className="divide-y divide-border/50">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block py-7"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <h2 className="text-[15px] font-medium leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                {post.publishedAt && (
                  <span className="text-xs text-muted-foreground tabular-nums shrink-0 mt-0.5">
                    {formatDateShort(post.publishedAt)}
                  </span>
                )}
              </div>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-3">
                {post.summary}
              </p>
              <div className="flex items-center gap-2">
                {post.readingTime && (
                  <span className="text-xs text-muted-foreground">{post.readingTime}</span>
                )}
                {post.readingTime && post.tags.length > 0 && (
                  <span className="text-muted-foreground/40 text-xs">·</span>
                )}
                {post.tags.length > 0 && (
                  <div className="flex gap-1.5">
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                        style={{
                          background: "color-mix(in oklch, var(--color-primary) 10%, transparent)",
                          color: "var(--color-primary)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
