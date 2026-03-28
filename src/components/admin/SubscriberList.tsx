"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Subscriber = {
  id: string;
  email: string;
  confirmed: boolean;
  createdAt: Date;
};

export function SubscriberList({ subscribers: initial }: { subscribers: Subscriber[] }) {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`"${email}" adresini listeden silmek istediğinden emin misin?`)) return;
    setDeleting(id);
    await fetch(`/api/admin/subscribers/${id}`, { method: "DELETE" });
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
    setDeleting(null);
    router.refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold tracking-tight">Aboneler</h2>
        <span className="text-xs text-muted-foreground">{subscribers.length} abone</span>
      </div>

      {subscribers.length === 0 ? (
        <p className="text-[15px] text-muted-foreground">Henüz abone yok.</p>
      ) : (
        <div className="divide-y divide-border/50">
          {subscribers.map((s) => (
            <div key={s.id} className="flex items-center justify-between py-3 gap-4">
              <div className="min-w-0">
                <p className="text-[13px] truncate">{s.email}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {new Date(s.createdAt).toLocaleDateString("tr-TR")}
                  {!s.confirmed && (
                    <span className="ml-2 text-amber-500">onaylanmadı</span>
                  )}
                </p>
              </div>
              <button
                onClick={() => handleDelete(s.id, s.email)}
                disabled={deleting === s.id}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors shrink-0 disabled:opacity-40"
              >
                {deleting === s.id ? "Siliniyor..." : "Sil"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
