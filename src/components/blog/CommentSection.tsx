"use client";

import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";
import type { Comment } from "@/types";

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);

function LikeButton({ commentId, initialCount }: { commentId: string; initialCount: number }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(`liked-comment-${commentId}`)) setLiked(true);
  }, [commentId]);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/comments/${commentId}/like`, {
        method: liked ? "DELETE" : "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setCount(data.likes);
        setLiked(!liked);
        liked
          ? localStorage.removeItem(`liked-comment-${commentId}`)
          : localStorage.setItem(`liked-comment-${commentId}`, "1");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className="flex items-center gap-1 text-[12px] transition-colors shrink-0"
      style={{ color: liked ? "var(--color-primary)" : "var(--color-muted-foreground)" }}
    >
      <HeartIcon filled={liked} />
      {count > 0 && <span>{count}</span>}
    </button>
  );
}

function ReplyForm({
  postId,
  parentId,
  onCancel,
  onSubmitted,
}: {
  postId: string;
  parentId: string;
  onCancel: () => void;
  onSubmitted: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const inputClass = "w-full px-3 py-1.5 text-[13px] rounded-lg border border-border/60 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName: name, authorEmail: email, content, parentId }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      onSubmitted();
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <p className="text-[12px] text-muted-foreground py-2">
        Yanıtın alındı, onaylandıktan sonra görünecek.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-2">
      <div className="grid grid-cols-2 gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="İsim" required className={inputClass} />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-posta" required className={inputClass} />
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Yanıtın..."
        required
        rows={2}
        className={`${inputClass} resize-none`}
      />
      <div className="flex gap-2 items-center">
        <button
          type="submit"
          disabled={submitting}
          className="px-3 py-1.5 text-[12px] font-medium rounded-lg transition-opacity disabled:opacity-60"
          style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}
        >
          {submitting ? "..." : "Gönder"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-[12px] text-muted-foreground hover:text-foreground transition-colors"
        >
          İptal
        </button>
      </div>
    </form>
  );
}

function CommentCard({ comment, postId }: { comment: Comment; postId: string }) {
  const [replyOpen, setReplyOpen] = useState(false);

  return (
    <div className="py-4">
      <div className="flex items-start gap-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold select-none mt-0.5"
          style={{ background: "var(--color-accent)", color: "var(--color-accent-foreground)" }}
        >
          {comment.authorName[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium">{comment.authorName}</span>
              <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
            </div>
            <LikeButton commentId={comment.id} initialCount={comment._count?.likes ?? 0} />
          </div>
          <p className="text-[14px] text-foreground/80 leading-relaxed mb-2">
            {comment.content}
          </p>
          {!replyOpen && (
            <button
              onClick={() => setReplyOpen(true)}
              className="text-[12px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Yanıtla
            </button>
          )}
          {replyOpen && (
            <ReplyForm
              postId={postId}
              parentId={comment.id}
              onCancel={() => setReplyOpen(false)}
              onSubmitted={() => setReplyOpen(false)}
            />
          )}
        </div>
      </div>

      {/* Yanıtlar */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-10 mt-1 pl-3 border-l border-border/60 divide-y divide-border/40">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="py-3 flex items-start gap-2.5">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-[11px] font-semibold select-none mt-0.5"
                style={{ background: "var(--color-muted)", color: "var(--color-muted-foreground)" }}
              >
                {reply.authorName[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[13px] font-medium">{reply.authorName}</span>
                    <span className="text-[11px] text-muted-foreground">{formatDate(reply.createdAt)}</span>
                  </div>
                  <LikeButton commentId={reply.id} initialCount={reply._count?.likes ?? 0} />
                </div>
                <p className="text-[13px] text-foreground/80 leading-relaxed">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments] = useState<Comment[]>(initialComments);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const inputClass = "w-full px-3 py-2 text-sm rounded-lg border border-border/60 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !content.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName: name, authorEmail: email, content }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      setName("");
      setEmail("");
      setContent("");
    } catch {
      setError("Yorum gönderilirken bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-12 pt-8 border-t border-border/60">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Yorumlar
        </span>
        {comments.length > 0 && (
          <span className="text-xs text-muted-foreground">{comments.length} yorum</span>
        )}
      </div>

      {comments.length > 0 && (
        <div className="divide-y divide-border/60 mb-10">
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} postId={postId} />
          ))}
        </div>
      )}

      <div>
        <p className="text-[13px] text-muted-foreground mb-5">
          {!submitted && "Düşüncelerini paylaş — yorumun onaylandıktan sonra yayınlanır."}
        </p>

        {submitted ? (
          <div className="py-6 text-center">
            <p className="text-sm font-medium mb-1">Yorumun alındı, teşekkürler!</p>
            <p className="text-xs text-muted-foreground">Onaylandıktan sonra burada görünecek.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">İsim</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Adın" required className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">E-posta</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-posta adresin" required className={inputClass} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Yorum</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Düşüncelerini yaz..."
                rows={4}
                required
                className={`${inputClass} resize-none`}
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-60 cursor-pointer"
              style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}
            >
              {submitting ? "Gönderiliyor..." : "Gönder"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
