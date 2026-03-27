"use client";

import { useEffect } from "react";

export function ViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    fetch(`/api/posts/${postId}/views`, { method: "POST" });
  }, [postId]);

  return null;
}
