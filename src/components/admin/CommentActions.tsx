"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, Trash2 } from "lucide-react";

interface CommentActionsProps {
  commentId: string;
  approved: boolean;
}

export function CommentActions({ commentId, approved }: CommentActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    await fetch(`/api/admin/comments/${commentId}/approve`, { method: "POST" });
    router.refresh();
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Bu yorumu silmek istediğine emin misin?")) return;
    setLoading(true);
    await fetch(`/api/admin/comments/${commentId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex gap-1 shrink-0">
      {!approved && (
        <Button variant="ghost" size="sm" onClick={handleApprove} disabled={loading}>
          <Check className="w-4 h-4" />
        </Button>
      )}
      <Button variant="ghost" size="sm" onClick={handleDelete} disabled={loading}
        className="text-destructive hover:text-destructive">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
