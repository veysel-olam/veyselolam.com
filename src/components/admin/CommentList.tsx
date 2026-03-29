"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Comment = {
  id: string;
  authorName: string;
  content: string;
  createdAt: Date;
  approved: boolean;
  parentId: string | null;
  post: { title: string; slug: string };
};

export function CommentList({ comments }: { comments: Comment[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [approvingAll, setApprovingAll] = useState(false);

  const pending = comments.filter((c) => !c.approved);
  const approved = comments.filter((c) => c.approved);

  const handleApprove = async (id: string) => {
    setLoading(id);
    await fetch(`/api/admin/comments/${id}/approve`, { method: "POST" });
    router.refresh();
    setLoading(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu yorumu silmek istediğine emin misin?")) return;
    setLoading(id);
    await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(null);
  };

  const handleApproveAll = async () => {
    setApprovingAll(true);
    await fetch("/api/admin/comments/approve-all", { method: "POST" });
    router.refresh();
    setApprovingAll(false);
  };

  if (comments.length === 0) {
    return <p className="text-muted-foreground text-sm">Henüz yorum yok.</p>;
  }

  return (
    <>
      {pending.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Onay Bekliyor ({pending.length})
            </p>
            <button
              onClick={handleApproveAll}
              disabled={approvingAll}
              className="text-xs text-muted-foreground hover:text-foreground border border-border/60 px-2 py-0.5 rounded transition-colors disabled:opacity-50"
            >
              {approvingAll ? "Onaylanıyor..." : "Tümünü Onayla"}
            </button>
          </div>
          <div className="divide-y divide-border/60">
            {pending.map((comment) => (
              <CommentRow
                key={comment.id}
                comment={comment}
                loading={loading === comment.id}
                onApprove={() => handleApprove(comment.id)}
                onDelete={() => handleDelete(comment.id)}
              />
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
              <CommentRow
                key={comment.id}
                comment={comment}
                loading={loading === comment.id}
                onApprove={() => handleApprove(comment.id)}
                onDelete={() => handleDelete(comment.id)}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function CommentRow({
  comment,
  loading,
  onApprove,
  onDelete,
}: {
  comment: Comment;
  loading: boolean;
  onApprove: () => void;
  onDelete: () => void;
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
      <div className="flex gap-1 shrink-0">
        {!comment.approved && (
          <Button variant="ghost" size="sm" onClick={onApprove} disabled={loading}>
            <Check className="w-4 h-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          disabled={loading}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
