import { prisma } from "@/lib/prisma";
import { CommentList } from "@/components/admin/CommentList";

export const dynamic = "force-dynamic";

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    orderBy: [{ approved: "asc" }, { createdAt: "desc" }],
    include: {
      post: { select: { title: true, slug: true } },
    },
  });

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight mb-8">Yorumlar</h1>
      <CommentList comments={comments} />
    </div>
  );
}
