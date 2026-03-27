import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { compileMdxContent, extractToc } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { PostActions } from "@/components/blog/PostActions";
import { CommentSection } from "@/components/blog/CommentSection";
import { SubscribeForm } from "@/components/blog/SubscribeForm";
import { ViewTracker } from "./ViewTracker";
import type { Comment } from "@/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `${siteUrl}/blog/${post.slug}`,
      ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      _count: { select: { likes: true } },
    },
  });

  if (!post) notFound();

  const [{ content }, rawComments] = await Promise.all([
    compileMdxContent(post.content),
    prisma.comment.findMany({
      where: { postId: post.id, approved: true, parentId: null },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { likes: true } },
        replies: {
          where: { approved: true },
          orderBy: { createdAt: "asc" },
          include: { _count: { select: { likes: true } } },
        },
      },
    }),
  ]);

  const toc = extractToc(post.content);

  const comments: Comment[] = rawComments.map((c) => ({
    id: c.id,
    postId: c.postId,
    parentId: c.parentId,
    authorName: c.authorName,
    content: c.content,
    createdAt: c.createdAt,
    _count: { likes: c._count.likes },
    replies: c.replies.map((r) => ({
      id: r.id,
      postId: r.postId,
      parentId: r.parentId,
      authorName: r.authorName,
      content: r.content,
      createdAt: r.createdAt,
      _count: { likes: r._count.likes },
    })),
  }));

  return (
    <>
      <ReadingProgress />
      <ViewTracker postId={post.id} />

      <main className="max-w-xl mx-auto px-6 pt-20 pb-32 relative">
        {toc.length > 0 && (
          <div className="hidden xl:block fixed top-24 right-[max(2rem,calc(50%-42rem))] w-52">
            <TableOfContents items={toc} />
          </div>
        )}

        <article>
          <header className="mb-10">
            {post.tags.length > 0 && (
              <div className="flex gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs text-muted-foreground">#{tag}</span>
                ))}
              </div>
            )}
            <h1 className="text-2xl font-semibold tracking-tight mb-3 leading-snug">
              {post.title}
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-4">{post.summary}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
              {post.readingTime && <span>{post.readingTime}</span>}
              <span>{post.views} görüntülenme</span>
            </div>
          </header>

          {post.coverImage && (
            <div className="mb-10 rounded-xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.coverImage} alt={post.title} className="w-full" />
            </div>
          )}

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {content}
          </div>
        </article>

        <div className="mt-10 pt-8 border-t border-border/60">
          <PostActions
            postId={post.id}
            slug={post.slug}
            title={post.title}
            initialLikes={post._count.likes}
          />
        </div>

        <div className="mt-10">
          <SubscribeForm />
        </div>

        <CommentSection postId={post.id} initialComments={comments} />
      </main>
    </>
  );
}
