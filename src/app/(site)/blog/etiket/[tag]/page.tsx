import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateShort } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return { title: `#${decoded}`, description: `"${decoded}" etiketli yazılar.` };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);

  const posts = await prisma.post.findMany({
    where: { published: true, tags: { has: decoded } },
    orderBy: { publishedAt: "desc" },
    select: { slug: true, title: true, summary: true, publishedAt: true, readingTime: true, tags: true },
  });

  if (posts.length === 0) notFound();

  return (
    <main className="max-w-xl mx-auto px-6 pt-24 pb-32">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <Link href="/blog" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Yazılar
          </Link>
          <span className="text-muted-foreground/30 text-xs">/</span>
          <span
            className="px-2 py-0.5 rounded-full text-[11px] font-medium"
            style={{
              background: "color-mix(in oklch, var(--color-primary) 10%, transparent)",
              color: "var(--color-primary)",
            }}
          >
            {decoded}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{posts.length} yazı</span>
      </div>

      <div className="divide-y divide-border/50">
        {posts.map((post) => (
          <div key={post.slug} className="group py-7">
            <div className="flex items-start justify-between gap-4 mb-2">
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-[15px] font-medium leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
              </Link>
              {post.publishedAt && (
                <span className="text-xs text-muted-foreground tabular-nums shrink-0 mt-0.5">
                  {formatDateShort(post.publishedAt)}
                </span>
              )}
            </div>
            <Link href={`/blog/${post.slug}`}>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-3">{post.summary}</p>
            </Link>
            <div className="flex items-center gap-2">
              {post.readingTime && (
                <span className="text-xs text-muted-foreground">{post.readingTime}</span>
              )}
              {post.readingTime && post.tags.length > 0 && (
                <span className="text-muted-foreground/40 text-xs">·</span>
              )}
              <div className="flex gap-1.5">
                {post.tags.map((t: string) => (
                  <Link
                    key={t}
                    href={`/blog/etiket/${encodeURIComponent(t)}`}
                    className="px-2 py-0.5 rounded-full text-[11px] font-medium transition-opacity hover:opacity-70"
                    style={{
                      background: t === decoded
                        ? "color-mix(in oklch, var(--color-primary) 18%, transparent)"
                        : "color-mix(in oklch, var(--color-primary) 10%, transparent)",
                      color: "var(--color-primary)",
                    }}
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
