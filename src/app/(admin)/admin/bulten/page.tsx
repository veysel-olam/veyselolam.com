import { prisma } from "@/lib/prisma";
import { NewsletterList } from "@/components/admin/NewsletterList";

export const dynamic = "force-dynamic";

export default async function NewsletterAdminPage() {
  const [newsletters, subscriberCount] = await Promise.all([
    prisma.newsletter.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.subscriber.count({ where: { confirmed: true } }),
  ]);

  return <NewsletterList newsletters={newsletters} subscriberCount={subscriberCount} />;
}
