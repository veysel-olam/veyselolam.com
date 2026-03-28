"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeletePostButton({ postId, postTitle }: { postId: string; postTitle: string }) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`"${postTitle}" yazısını silmek istediğinden emin misin? Bu işlem geri alınamaz.`)) return;
    setDeleting(true);
    await fetch(`/api/admin/posts/${postId}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
    >
      {deleting ? "Siliniyor..." : "Sil"}
    </button>
  );
}
