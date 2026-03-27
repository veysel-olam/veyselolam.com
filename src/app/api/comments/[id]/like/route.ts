import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getIdentifier(req: NextRequest) {
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "anonymous"
  );
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const identifier = getIdentifier(req);

  try {
    await prisma.commentLike.create({ data: { commentId: id, identifier } });
  } catch {
    // zaten beğenilmiş
  }

  const likes = await prisma.commentLike.count({ where: { commentId: id } });
  return NextResponse.json({ likes });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const identifier = getIdentifier(req);

  await prisma.commentLike.deleteMany({ where: { commentId: id, identifier } });
  const likes = await prisma.commentLike.count({ where: { commentId: id } });
  return NextResponse.json({ likes });
}
