import { Feed } from "feed";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://veyselolam.com";

  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 20,
    select: { slug: true, title: true, summary: true, publishedAt: true },
  }).catch(() => [] as { slug: string; title: string; summary: string; publishedAt: Date | null }[]);

  const feed = new Feed({
    title: "Veysel Olam",
    description: "Yazılım, teknoloji ve düşünceler.",
    id: siteUrl,
    link: siteUrl,
    language: "tr",
    copyright: `© ${new Date().getFullYear()} Veysel Olam`,
    author: { name: "Veysel Olam", link: siteUrl },
  });

  posts.forEach((post: { slug: string; title: string; summary: string; publishedAt: Date | null }) => {
    feed.addItem({
      title: post.title,
      id: `${siteUrl}/blog/${post.slug}`,
      link: `${siteUrl}/blog/${post.slug}`,
      description: post.summary,
      date: post.publishedAt ?? new Date(),
    });
  });

  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
