import { prisma } from "@/lib/prisma";
import { AboutEditor } from "@/components/admin/AboutEditor";

export const dynamic = "force-dynamic";

export default async function AboutAdminPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content = await (prisma as any).siteContent.findUnique({ where: { key: "hakkimda" } }) as { value: string } | null;
  return <AboutEditor initialValue={content?.value ?? ""} />;
}
