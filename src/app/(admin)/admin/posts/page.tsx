import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateShort } from "@/lib/utils";
import { DeletePostButton } from "@/components/admin/DeletePostButton";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      published: true,
      publishedAt: true,
      views: true,
      createdAt: true,
      _count: { select: { likes: true, comments: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold tracking-tight">Yazılar</h1>
        <Link
          href="/admin/posts/new"
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-opacity"
          style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}
        >
          Yeni Yazı
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground text-sm">Henüz yazı yok.</p>
      ) : (
        <div className="divide-y divide-border/60">
          {posts.map((post) => (
            <div key={post.id} className="py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="text-sm font-medium hover:text-primary transition-colors truncate"
                  >
                    {post.title}
                  </Link>
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-full shrink-0 ${
                    post.published
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {post.published ? "Yayında" : "Taslak"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDateShort(post.createdAt)} · {post.views} görüntülenme · {post._count.likes} beğeni · {post._count.comments} yorum
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {post.published && (
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Görüntüle
                  </Link>
                )}
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Düzenle
                </Link>
                <DeletePostButton postId={post.id} postTitle={post.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
