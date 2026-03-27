import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { CommentActions } from "@/components/admin/CommentActions";

export const dynamic = "force-dynamic";

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    orderBy: [{ approved: "asc" }, { createdAt: "desc" }],
    include: {
      post: { select: { title: true, slug: true } },
    },
  });

  const pending = comments.filter((c) => !c.approved);
  const approved = comments.filter((c) => c.approved);

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight mb-8">Yorumlar</h1>

      {comments.length === 0 && (
        <p className="text-muted-foreground text-sm">Henüz yorum yok.</p>
      )}

      {pending.length > 0 && (
        <section className="mb-10">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
            Onay Bekliyor ({pending.length})
          </p>
          <div className="divide-y divide-border/60">
            {pending.map((comment) => (
              <CommentRow key={comment.id} comment={comment} />
            ))}
          </div>
        </section>
      )}

      {approved.length > 0 && (
        <section>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
            Onaylı ({approved.length})
          </p>
          <div className="divide-y divide-border/60">
            {approved.map((comment) => (
              <CommentRow key={comment.id} comment={comment} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function CommentRow({
  comment,
}: {
  comment: {
    id: string;
    authorName: string;
    content: string;
    createdAt: Date;
    approved: boolean;
    parentId: string | null;
    post: { title: string; slug: string };
  };
}) {
  return (
    <div className="py-4 flex items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm font-medium">{comment.authorName}</span>
          <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
          {comment.parentId && (
            <span className="text-xs text-muted-foreground">↳ yanıt</span>
          )}
        </div>
        <p className="text-sm text-foreground/80 mb-1">{comment.content}</p>
        <p className="text-xs text-muted-foreground">{comment.post.title}</p>
      </div>
      <CommentActions commentId={comment.id} approved={comment.approved} />
    </div>
  );
}
