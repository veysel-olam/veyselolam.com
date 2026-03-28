import { prisma } from "@/lib/prisma";
import { NewsletterList } from "@/components/admin/NewsletterList";
import { SubscriberList } from "@/components/admin/SubscriberList";

export const dynamic = "force-dynamic";

export default async function NewsletterAdminPage() {
  const [newsletters, subscribers] = await Promise.all([
    prisma.newsletter.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const confirmedCount = subscribers.filter((s: { confirmed: boolean }) => s.confirmed).length;

  return (
    <div className="space-y-16">
      <NewsletterList newsletters={newsletters} subscriberCount={confirmedCount} />
      <SubscriberList subscribers={subscribers} />
    </div>
  );
}
