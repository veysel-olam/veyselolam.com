import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sendNewsletter } from "@/lib/mail";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return false;
  return true;
}

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;

  const [newsletter, subscribers] = await Promise.all([
    prisma.newsletter.findUnique({ where: { id } }),
    prisma.subscriber.findMany({ where: { confirmed: true }, select: { id: true, email: true } }),
  ]);

  if (!newsletter) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  if (newsletter.sentAt) return NextResponse.json({ error: "Zaten gönderildi." }, { status: 409 });

  const recipients = subscribers;
  const { sent, failed } = await sendNewsletter({
    subject: newsletter.subject,
    title: newsletter.title,
    content: newsletter.content,
    recipients,
  });

  await prisma.newsletter.update({
    where: { id },
    data: { sentAt: new Date() },
  });

  return NextResponse.json({ sent, failed });
}
