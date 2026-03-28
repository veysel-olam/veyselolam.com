import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return false;
  return true;
}

export async function GET() {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const newsletters = await prisma.newsletter.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, subject: true, sentAt: true, createdAt: true },
  });

  return NextResponse.json(newsletters);
}

export async function POST(req: NextRequest) {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { title, subject, content } = await req.json();
  if (!title || !subject || !content) {
    return NextResponse.json({ error: "Eksik alan." }, { status: 400 });
  }

  const newsletter = await prisma.newsletter.create({
    data: { title, subject, content },
  });

  return NextResponse.json(newsletter, { status: 201 });
}
