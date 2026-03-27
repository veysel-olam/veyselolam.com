import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { compileMdxContent, extractToc } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { TableOfContents } from "@/components/blog/TableOfContents";

export const dynamic = "force-dynamic";

export default async function PreviewPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  const { content } = await compileMdxContent(post.content);
  const toc = extractToc(post.content);

  return (
    <div className="relative">
      <div className="mb-6 px-3 py-2 rounded-lg bg-muted text-sm text-muted-foreground">
        Önizleme modu — bu yazı henüz yayınlanmadı.
      </div>

      <div className="flex gap-12">
        <article className="flex-1 min-w-0 max-w-xl">
          <header className="mb-10">
            {post.tags.length > 0 && (
              <div className="flex gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs text-muted-foreground">#{tag}</span>
                ))}
              </div>
            )}
            <h1 className="text-2xl font-semibold tracking-tight mb-3">{post.title}</h1>
            <p className="text-muted-foreground leading-relaxed mb-4">{post.summary}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}</span>
              {post.readingTime && <span>{post.readingTime}</span>}
            </div>
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {content}
          </div>
        </article>

        {toc.length > 0 && (
          <aside className="hidden xl:block w-56 shrink-0">
            <TableOfContents items={toc} />
          </aside>
        )}
      </div>
    </div>
  );
}
