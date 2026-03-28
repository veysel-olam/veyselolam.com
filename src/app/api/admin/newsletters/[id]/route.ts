import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return false;
  return true;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;
  const { title, subject, content } = await req.json();

  const newsletter = await prisma.newsletter.update({
    where: { id },
    data: { title, subject, content },
  });

  return NextResponse.json(newsletter);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;
  await prisma.newsletter.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
