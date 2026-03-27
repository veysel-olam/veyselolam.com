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
      _count: { select: { likes: true } },
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
        <p className="text-muted-foreground text-sm">Henüz yayınlanmış yazı yok.</p>
      ) : (
        <div className="divide-y divide-border/60">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block py-6"
            >
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <h2 className="text-[15px] font-medium group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                {post.publishedAt && (
                  <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                    {formatDateShort(post.publishedAt)}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                {post.summary}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {post.readingTime && <span>{post.readingTime}</span>}
                {post.tags.length > 0 && (
                  <span>{post.tags.map((t) => `#${t}`).join(" ")}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
