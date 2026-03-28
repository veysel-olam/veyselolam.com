"use client";

import { useState } from "react";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "already" | "error" | "ratelimit">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website: honeypot }),
      });
      const data = await res.json();

      if (res.status === 429) {
        setStatus("ratelimit");
        return;
      }

      if (res.ok) {
        if (data.status === "already_subscribed") {
          setStatus("already");
        } else {
          setStatus("success");
          setEmail("");
        }
      } else {
        setErrorMsg(data.error ?? "Bir hata oluştu.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Bir hata oluştu, tekrar dene.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return <p className="text-[13px] text-primary">Abone oldun. Hoş geldin!</p>;
  }

  if (status === "already") {
    return <p className="text-[13px] text-muted-foreground">Bu adres zaten listede.</p>;
  }

  if (status === "ratelimit") {
    return <p className="text-[13px] text-muted-foreground">Çok fazla deneme. Bir süre bekle.</p>;
  }

  return (
    <div className="space-y-2">
      {/* Honeypot - botlar görür, insanlar görmez */}
      <input
        type="text"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
      />
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
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
        <p className="text-[12px] text-destructive">{errorMsg}</p>
      )}
    </div>
  );
}
