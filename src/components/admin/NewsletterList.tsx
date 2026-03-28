"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Newsletter = {
  id: string;
  title: string;
  subject: string;
  content: string;
  sentAt: Date | null;
  createdAt: Date;
};

interface Props {
  newsletters: Newsletter[];
  subscriberCount: number;
}

export function NewsletterList({ newsletters: initial, subscriberCount }: Props) {
  const router = useRouter();
  const [newsletters, setNewsletters] = useState(initial);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Newsletter | null>(null);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [error, setError] = useState("");

  const resetForm = () => {
    setTitle(""); setSubject(""); setContent("");
    setCreating(false); setEditing(null); setError("");
  };

  const openEdit = (nl: Newsletter) => {
    setEditing(nl);
    setTitle(nl.title); setSubject(nl.subject); setContent(nl.content);
    setCreating(false);
  };

  const handleSave = async () => {
    if (!title.trim() || !subject.trim() || !content.trim()) {
      setError("Tüm alanları doldurun."); return;
    }
    setSaving(true); setError("");
    try {
      if (editing) {
        const res = await fetch(`/api/admin/newsletters/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, subject, content }),
        });
        const updated = await res.json();
        setNewsletters((prev) => prev.map((n) => n.id === updated.id ? updated : n));
      } else {
        const res = await fetch("/api/admin/newsletters", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, subject, content }),
        });
        const created = await res.json();
        setNewsletters((prev) => [created, ...prev]);
      }
      resetForm();
      router.refresh();
    } catch {
      setError("Kayıt hatası.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu bülteni silmek istediğinden emin misin?")) return;
    await fetch(`/api/admin/newsletters/${id}`, { method: "DELETE" });
    setNewsletters((prev) => prev.filter((n) => n.id !== id));
  };

  const handleSend = async (id: string) => {
    if (!confirm(`${subscriberCount} onaylı aboneye göndermek istediğinden emin misin?`)) return;
    setSending(id);
    try {
      const res = await fetch(`/api/admin/newsletters/${id}/send`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) { alert(data.error); return; }
      alert(`Gönderildi: ${data.sent} başarılı${data.failed > 0 ? `, ${data.failed} hatalı` : ""}`);
      setNewsletters((prev) =>
        prev.map((n) => n.id === id ? { ...n, sentAt: new Date() } : n)
      );
      router.refresh();
    } finally {
      setSending(null);
    }
  };

  const showForm = creating || editing !== null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Bülten</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{subscriberCount} onaylı abone</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { resetForm(); setCreating(true); }}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-opacity"
            style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}
          >
            Yeni Bülten
          </button>
        )}
      </div>

      {showForm && (
        <div className="border border-border/60 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-medium">{editing ? "Düzenle" : "Yeni Bülten"}</h2>
          {error && (
            <p className="text-[13px] text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
          )}
          <div className="space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Başlık (arşivde görünen ad)"
              className="w-full bg-transparent border border-border/60 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
            />
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="E-posta konusu"
              className="w-full bg-transparent border border-border/60 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="İçerik (düz metin, satır atlamalarla bölüm oluştur)"
              rows={10}
              className="w-full bg-transparent border border-border/60 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors resize-none font-mono"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50"
              style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <button
              onClick={resetForm}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border border-border/60 text-muted-foreground hover:text-foreground transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      {newsletters.length === 0 ? (
        <p className="text-[15px] text-muted-foreground">Henüz bülten yok.</p>
      ) : (
        <div className="divide-y divide-border/50">
          {newsletters.map((nl) => (
            <div key={nl.id} className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[14px] font-medium">{nl.title}</p>
                  <p className="text-[13px] text-muted-foreground mt-0.5">{nl.subject}</p>
                  <p className="text-[12px] text-muted-foreground/60 mt-1">
                    {nl.sentAt
                      ? `Gönderildi: ${new Date(nl.sentAt).toLocaleDateString("tr-TR")}`
                      : "Taslak"}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!nl.sentAt && (
                    <>
                      <button
                        onClick={() => openEdit(nl)}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleSend(nl.id)}
                        disabled={sending === nl.id}
                        className="text-xs font-medium transition-colors disabled:opacity-50"
                        style={{ color: "var(--color-primary)" }}
                      >
                        {sending === nl.id ? "Gönderiliyor..." : "Gönder"}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(nl.id)}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
