"use client";

import { useState, useRef } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inlineFileInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

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
      const tag = `\n![](${data.url})\n`;
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

  const handleSave = async (publish?: boolean) => {
    if (!title.trim() || !slug.trim() || !summary.trim() || !content.trim()) {
      setError("Tüm alanları doldurun.");
      return;
    }
    setSaving(true);
    setError("");

    const readingTimeValue = getReadingTime(content);
    const isPublished = publish !== undefined ? publish : published;

    try {
      const url = isEditing ? `/api/admin/posts/${initialData.id}` : "/api/admin/posts";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, slug, summary, content,
          coverImage: coverImage || null,
          published: isPublished,
          readingTime: readingTimeValue,
          publishedAt: isPublished ? new Date().toISOString() : null,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Kayıt hatası");
      }

      const data = await res.json();

      if (isEditing) {
        setPublished(isPublished);
        router.refresh();
        setSaveStatus(isPublished ? "published" : "draft");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        router.push(`/admin/posts/${data.id}`);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight">
            {isEditing ? "Yazıyı Düzenle" : "Yeni Yazı"}
          </h1>
          <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${
            published
              ? "bg-accent text-accent-foreground"
              : "bg-muted text-muted-foreground"
          }`}>
            {published ? "Yayında" : "Taslak"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {isEditing && published && (
            <Link
              href={`/blog/${slug}`}
              target="_blank"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sayfayı Aç →
            </Link>
          )}
          {isEditing && !published && (
            <Link
              href={`/admin/posts/${initialData.id}/preview`}
              target="_blank"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Önizle →
            </Link>
          )}
          {saveStatus !== "idle" && (
            <span className="text-[13px] text-muted-foreground">
              {saveStatus === "published" ? "Yayınlandı" : "Taslak kaydedildi"}
            </span>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-colors disabled:opacity-50"
            >
              Taslak Kaydet
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50"
              style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}
            >
              {saving ? "Kaydediliyor..." : "Yayınla"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-[13px] text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <div className="grid gap-4">
        <div className="space-y-1.5">
          <Label>Başlık</Label>
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Yazı başlığı"
            className="text-lg font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Slug (URL)</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(generateSlug(e.target.value))}
              placeholder="yazi-basligi"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Kapak Görseli</Label>
            <div className="flex gap-2">
              <Input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://... veya yükle →"
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-3 py-1.5 rounded-lg text-sm border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-colors disabled:opacity-50 shrink-0"
              >
                {uploading ? "Yükleniyor..." : "Yükle"}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
            />
            {coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImage} alt="Kapak önizleme" className="mt-2 rounded-lg max-h-32 object-cover" />
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Etiketler</Label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="nextjs, typescript, react  (virgülle ayır)"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Özet</Label>
          <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Yazı özeti (SEO ve liste sayfasında görünür)"
            rows={2}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label>İçerik (MDX)</Label>
          <button
            type="button"
            onClick={() => inlineFileInputRef.current?.click()}
            disabled={uploading}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            {uploading ? "Yükleniyor..." : "+ Görsel ekle"}
          </button>
        </div>
        <input
          ref={inlineFileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleInlineUpload(f); e.target.value = ""; }}
        />
        <Textarea
          ref={contentTextareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="## Başlık&#10;&#10;İçerik buraya..."
          rows={28}
          className="font-mono text-sm resize-none"
        />
        <p className="text-xs text-muted-foreground">
          {content.length > 0 && `${getReadingTime(content)} · ${content.length} karakter`}
        </p>
      </div>
    </div>
  );
}
