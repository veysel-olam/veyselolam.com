import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateShort } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getRecentPosts() {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 4,
    select: {
      slug: true,
      title: true,
      summary: true,
      publishedAt: true,
      readingTime: true,
    },
  });
}

export default async function HomePage() {
  const recentPosts = await getRecentPosts();

  return (
    <main className="max-w-xl mx-auto px-6 pt-24 pb-32">

      {/* Hero */}
      <section className="mb-14">
        {/* Terminal imleç efekti */}
        <div className="mb-8 flex items-center gap-2 font-mono text-[13px] text-muted-foreground select-none">
          <span>~/veyselolam</span>
          <span style={{ color: "var(--color-primary)" }}>$</span>
          <div
            className="terminal-cursor w-[7px] h-[15px] rounded-[2px]"
            style={{ background: "var(--color-primary)" }}
          />
        </div>

        <p className="text-muted-foreground leading-relaxed text-[15px]">
          Yazılım geliştirici. Teknoloji ve dünyada olup bitenler üzerine yazıyorum.
        </p>
      </section>

      {/* Son Yazılar */}
      {recentPosts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Son Yazılar
            </span>
            <Link
              href="/blog"
              className="text-xs text-primary hover:opacity-80 transition-opacity"
            >
              Tümü →
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {recentPosts.map((post: (typeof recentPosts)[number]) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex items-baseline justify-between gap-4 py-3.5"
              >
                <div className="min-w-0">
                  <span className="text-[15px] font-medium group-hover:text-primary transition-colors line-clamp-1">
                    {post.title}
                  </span>
                  <span className="block text-[15px] text-muted-foreground mt-0.5 line-clamp-1">
                    {post.summary}
                  </span>
                </div>
                <div className="shrink-0 text-xs text-muted-foreground tabular-nums">
                  {post.publishedAt && formatDateShort(post.publishedAt)}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
