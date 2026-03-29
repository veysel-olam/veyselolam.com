"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getReadingTime } from "@/lib/mdx";

interface PostEditorProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    coverImage: string | null;
    published: boolean;
    tags: string[];
    updatedAt?: Date | string;
  };
}

export function PostEditor({ initialData }: PostEditorProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [summary, setSummary] = useState(initialData?.summary ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? "");
  const [tags, setTags] = useState((initialData?.tags ?? []).join(", "));
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "draft" | "published">("idle");

  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saved">("idle");
  const [showRestoreBanner, setShowRestoreBanner] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<null | {
    title: string; slug: string; summary: string;
    content: string; coverImage: string; tags: string;
  }>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inlineFileInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  const DRAFT_KEY = `draft_${initialData?.id ?? "new"}`;

  // On mount: check for a saved draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as {
        title: string; slug: string; summary: string;
        content: string; coverImage: string; tags: string; savedAt: number;
      };
      const savedAt = draft.savedAt ?? 0;
      const thirtySecondsAgo = Date.now() - 30_000;
      if (savedAt < thirtySecondsAgo) return;
      // For editing, only offer restore if draft is newer than current post
      if (initialData?.updatedAt) {
        const postUpdatedAt = new Date(initialData.updatedAt).getTime();
        if (savedAt <= postUpdatedAt) return;
      }
      setPendingDraft(draft);
      setShowRestoreBanner(true);
    } catch {
      // ignore parse errors
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const value = JSON.stringify({ title, slug, summary, content, coverImage, tags, savedAt: Date.now() });
        localStorage.setItem(DRAFT_KEY, value);
        setAutoSaveStatus("saved");
        setTimeout(() => setAutoSaveStatus("idle"), 2000);
      } catch {
        // ignore storage errors
      }
    }, 30_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, slug, summary, content, coverImage, tags]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Yükleme hatası."); return; }
      setCoverImage(data.url);
    } finally {
      setUploading(false);
    }
  };

  const handleInlineUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Yükleme hatası."); return; }
      const altText = window.prompt("Görsel açıklaması (alt metin):", "") ?? "";
      const tag = `\n![${altText}](${data.url})\n`;
      const el = contentTextareaRef.current;
      if (el) {
        const start = el.selectionStart ?? content.length;
        setContent(content.slice(0, start) + tag + content.slice(start));
      } else {
        setContent((c) => c + tag);
      }
    } finally {
      setUploading(false);
    }
  };

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
      .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditing) setSlug(generateSlug(value));
  };

  const buildPayload = (isPublished: boolean) => ({
    title, slug, summary, content,
    coverImage: coverImage || null,
    published: isPublished,
    readingTime: getReadingTime(content),
    publishedAt: isPublished ? new Date().toISOString() : null,
    tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
  });

  const handleSave = async (publish?: boolean): Promise<string | null> => {
    if (!title.trim() || !slug.trim() || !summary.trim() || !content.trim()) {
      setError("Tüm alanları doldurun.");
      return null;
    }
    setSaving(true);
    setError("");
    const isPublished = publish !== undefined ? publish : published;

    try {
      const url = isEditing ? `/api/admin/posts/${initialData.id}` : "/api/admin/posts";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(isPublished)),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Kayıt hatası");
      }
      const data = await res.json();
      // Clear auto-save draft on successful save
      try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      if (isEditing) {
        setPublished(isPublished);
        router.refresh();
        setSaveStatus(isPublished ? "published" : "draft");
        setTimeout(() => setSaveStatus("idle"), 3000);
        return initialData.id;
      } else {
        router.refresh();
        return data.id;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!e.ctrlKey && !e.metaKey) return;
    const el = e.currentTarget;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.slice(start, end);

    const wrap = (marker: string) => {
      e.preventDefault();
      const newContent = content.slice(0, start) + marker + selected + marker + content.slice(end);
      setContent(newContent);
      setTimeout(() => {
        el.selectionStart = start + marker.length;
        el.selectionEnd = end + marker.length;
      }, 0);
    };

    if (e.key === "b") wrap("**");
    if (e.key === "i") wrap("_");
    if (e.key === "k") {
      e.preventDefault();
      const url = window.prompt("Link URL:", "https://");
      if (url) {
        const linkText = selected || "link";
        const newContent = content.slice(0, start) + `[${linkText}](${url})` + content.slice(end);
        setContent(newContent);
      }
    }
  };

  const handleSaveAndPreview = async () => {
    const id = await handleSave(false);
    if (id) {
      window.open(`/admin/posts/${id}/preview`, "_blank");
      if (!isEditing) router.push(`/admin/posts/${id}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight">
            {isEditing ? "Yazıyı Düzenle" : "Yeni Yazı"}
          </h1>
          <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${
            published ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
          }`}>
            {published ? "Yayında" : "Taslak"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {isEditing && published && (
            <Link href={`/blog/${slug}`} target="_blank"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sayfayı Aç →
            </Link>
          )}
          {autoSaveStatus === "saved" && (
            <span className="text-[13px] text-muted-foreground">Otomatik kaydedildi</span>
          )}
          {saveStatus !== "idle" && autoSaveStatus === "idle" && (
            <span className="text-[13px] text-muted-foreground">
              {saveStatus === "published" ? "Yayınlandı" : "Taslak kaydedildi"}
            </span>
          )}
          <div className="flex gap-2">
            <button onClick={handleSaveAndPreview} disabled={saving}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-colors disabled:opacity-50">
              {saving ? "..." : "Önizle"}
            </button>
            <button onClick={() => handleSave(false)} disabled={saving}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-colors disabled:opacity-50">
              Taslak Kaydet
            </button>
            <button onClick={() => handleSave(true)} disabled={saving}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50"
              style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
              {saving ? "Kaydediliyor..." : "Yayınla"}
            </button>
          </div>
        </div>
      </div>

      {showRestoreBanner && pendingDraft && (
        <div className="flex items-center justify-between text-[13px] bg-muted/60 border border-border/60 px-3 py-2 rounded-lg">
          <span className="text-muted-foreground">Kaydedilmemiş bir taslak bulundu. Geri yüklensin mi?</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setTitle(pendingDraft.title);
                setSlug(pendingDraft.slug);
                setSummary(pendingDraft.summary);
                setContent(pendingDraft.content);
                setCoverImage(pendingDraft.coverImage);
                setTags(pendingDraft.tags);
                setShowRestoreBanner(false);
                setPendingDraft(null);
              }}
              className="font-medium text-foreground hover:opacity-70 transition-opacity">
              Geri Yükle
            </button>
            <button
              onClick={() => { setShowRestoreBanner(false); setPendingDraft(null); }}
              className="text-muted-foreground hover:text-foreground transition-colors">
              Yoksay
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-[13px] text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
      )}

      {/* Meta alanlar */}
      <div className="grid gap-4">
        <div className="space-y-1.5">
          <Label>Başlık</Label>
          <Input value={title} onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Yazı başlığı" className="text-lg font-medium" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Slug (URL)</Label>
            <Input value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))}
              placeholder="yazi-basligi" />
          </div>
          <div className="space-y-1.5">
            <Label>Kapak Görseli</Label>
            <div className="flex gap-2">
              <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://... veya yükle →" className="flex-1" />
              <button type="button" onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-3 py-1.5 rounded-lg text-sm border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-colors disabled:opacity-50 shrink-0">
                {uploading ? "Yükleniyor..." : "Yükle"}
              </button>
            </div>
            <input ref={fileInputRef} type="file"
              accept="image/jpeg,image/png,image/webp,image/gif" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
            {coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImage} alt="Kapak önizleme"
                className="mt-2 rounded-lg max-h-32 object-cover" />
            )}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Etiketler</Label>
          <Input value={tags} onChange={(e) => setTags(e.target.value)}
            placeholder="nextjs, typescript, react  (virgülle ayır)" />
        </div>
        <div className="space-y-1.5">
          <Label>Özet</Label>
          <Textarea value={summary} onChange={(e) => setSummary(e.target.value)}
            placeholder="Yazı özeti (SEO ve liste sayfasında görünür)" rows={2} />
        </div>
      </div>

      {/* İçerik */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label>İçerik (MDX)</Label>
          <div className="flex items-center gap-3">
            {content.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {getReadingTime(content)} · {content.length} karakter
              </span>
            )}
            <button type="button" onClick={() => inlineFileInputRef.current?.click()}
              disabled={uploading}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50">
              {uploading ? "Yükleniyor..." : "+ Görsel ekle"}
            </button>
          </div>
        </div>
        <input ref={inlineFileInputRef} type="file"
          accept="image/jpeg,image/png,image/webp,image/gif" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleInlineUpload(f); e.target.value = ""; }} />
        <Textarea ref={contentTextareaRef} value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="## Başlık&#10;&#10;İçerik buraya..."
          rows={28} className="font-mono text-sm resize-none" />
      </div>
    </div>
  );
}
