"use client";

import { useState, useEffect } from "react";
import { Heart, Link2, Check, Mail } from "lucide-react";

interface PostActionsProps {
  postId: string;
  slug: string;
  title: string;
  initialLikes: number;
}

const btnBase =
  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer select-none border border-border/60";

const BlueSkyIcon = () => (
  <svg viewBox="0 0 568 501" fill="currentColor" className="w-4 h-4">
    <path d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 407.485 459.89 491.577c-71.516 80.569-130.05 32.025-173.89-32.564-43.84 64.589-102.374 113.133-173.89 32.564-76.554-84.092-47.332-167.777 66.543-187.327-65.72 11.185-139.6-7.295-159.875-79.748C12.945 203.66 3 75.293 3 57.947 3-28.906 79.134-1.611 123.121 33.664Z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export function PostActions({ postId, slug, title, initialLikes }: PostActionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(`liked-${postId}`)) setLiked(true);
  }, [postId]);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: liked ? "DELETE" : "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
        setLiked(!liked);
        liked
          ? localStorage.removeItem(`liked-${postId}`)
          : localStorage.setItem(`liked-${postId}`, "1");
      }
    } finally {
      setLoading(false);
    }
  };

  const getPostUrl = () => `${window.location.origin}/blog/${slug}`;

  const handleBluesky = () =>
    window.open(
      `https://bsky.app/intent/compose?text=${encodeURIComponent(`${title}\n${getPostUrl()}`)}`,
      "_blank",
      "noopener,noreferrer"
    );

  const handleLinkedIn = () =>
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getPostUrl())}`,
      "_blank",
      "noopener,noreferrer"
    );

  const handleWhatsApp = () =>
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${title}\n${getPostUrl()}`)}`,
      "_blank",
      "noopener,noreferrer"
    );

  const handleMail = () =>
    window.open(
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(getPostUrl())}`,
      "_self"
    );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getPostUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Beğeni */}
      <button
        onClick={handleLike}
        disabled={loading}
        className={btnBase}
        style={liked ? { color: "var(--color-primary)", borderColor: "var(--color-ring)" } : {}}
      >
        <Heart className="w-4 h-4" fill={liked ? "currentColor" : "none"} strokeWidth={1.8} />
        <span>{likes > 0 ? `${likes} beğeni` : "Beğen"}</span>
      </button>

      {/* Bluesky */}
      <button onClick={handleBluesky} className={btnBase}>
        <BlueSkyIcon />
        <span>Bluesky</span>
      </button>

      {/* LinkedIn */}
      <button onClick={handleLinkedIn} className={btnBase}>
        <LinkedInIcon />
        <span>LinkedIn</span>
      </button>

      {/* WhatsApp */}
      <button onClick={handleWhatsApp} className={btnBase}>
        <WhatsAppIcon />
        <span>WhatsApp</span>
      </button>

      {/* Mail */}
      <button onClick={handleMail} className={btnBase}>
        <Mail className="w-4 h-4" strokeWidth={1.6} />
        <span>Mail</span>
      </button>

      {/* Linki kopyala */}
      <button onClick={handleCopy} className={btnBase}>
        {copied ? (
          <Check className="w-4 h-4" strokeWidth={1.8} />
        ) : (
          <Link2 className="w-4 h-4" strokeWidth={1.8} />
        )}
        <span>{copied ? "Kopyalandı!" : "Linki kopyala"}</span>
      </button>
    </div>
  );
}
