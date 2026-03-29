import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  await prisma.comment.updateMany({ where: { approved: false }, data: { approved: true } });
  return NextResponse.json({ ok: true });
}
