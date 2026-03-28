import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SubscribeForm } from "@/components/blog/SubscribeForm";

export const metadata: Metadata = {
  title: "Bülten",
  description: "Yazılım, teknoloji ve düşünceler üzerine ara sıra derlenen bülten.",
};

export const dynamic = "force-dynamic";

export default async function BultenPage() {
  const newsletters = await prisma.newsletter.findMany({
    where: { sentAt: { not: null } },
    orderBy: { sentAt: "desc" },
    select: { id: true, title: true, subject: true, sentAt: true },
  });

  return (
    <main className="max-w-xl mx-auto px-6 pt-24 pb-32">
      <div className="flex items-center justify-between mb-10">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Bülten
        </span>
        {newsletters.length > 0 && (
          <span className="text-xs text-muted-foreground">{newsletters.length} sayı</span>
        )}
      </div>

      <div className="mb-12">
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
          Yazılım, teknoloji ve düşünceler üzerine ara sıra derlenen notlar. Spam yok, istediğin zaman ayrılabilirsin.
        </p>
        <SubscribeForm />
      </div>

      {newsletters.length > 0 && (
        <>
          <div className="mb-6">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Arşiv
            </span>
          </div>
          <div className="divide-y divide-border/50">
            {newsletters.map((nl) => (
              <div key={nl.id} className="py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[14px] font-medium leading-snug mb-0.5">{nl.title}</p>
                    <p className="text-[13px] text-muted-foreground">{nl.subject}</p>
                  </div>
                  {nl.sentAt && (
                    <span className="text-xs text-muted-foreground tabular-nums shrink-0 mt-0.5">
                      {new Date(nl.sentAt).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
