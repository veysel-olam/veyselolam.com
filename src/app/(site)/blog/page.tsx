import { prisma } from "@/lib/prisma";
import { BlogList } from "@/components/blog/BlogList";

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
      <BlogList posts={posts} />
    </main>
  );
}
