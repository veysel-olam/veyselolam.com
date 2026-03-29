"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export function AboutEditor({ initialValue }: { initialValue: string }) {
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "hakkimda", value }),
      });
      setStatus(res.ok ? "saved" : "error");
      setTimeout(() => setStatus("idle"), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Hakkımda</h1>
        <div className="flex items-center gap-3">
          {status === "saved" && <span className="text-[13px] text-muted-foreground">Kaydedildi</span>}
          {status === "error" && <span className="text-[13px] text-destructive">Hata</span>}
          <button onClick={handleSave} disabled={saving}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50"
            style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Düz metin. Paragraflar arasına boş satır bırak.</p>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={12}
        className="resize-none"
      />
    </div>
  );
}
