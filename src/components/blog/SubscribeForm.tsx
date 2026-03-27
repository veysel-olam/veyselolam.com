"use client";

import { useState } from "react";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "already" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus(data.message === "already_subscribed" ? "already" : "success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return <p className="text-[13px] text-primary">Abone oldun.</p>;
  }

  if (status === "already") {
    return <p className="text-[13px] text-muted-foreground">Bu adres zaten listede.</p>;
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-posta adresin"
          required
          className="flex-1 min-w-0 px-3 py-1.5 text-[13px] rounded-lg border border-border/60 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 px-3 py-1.5 text-[13px] font-medium rounded-lg transition-opacity disabled:opacity-60"
          style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}
        >
          {status === "loading" ? "..." : "Abone ol"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-[12px] text-destructive">Bir hata oluştu, tekrar dene.</p>
      )}
    </div>
  );
}
