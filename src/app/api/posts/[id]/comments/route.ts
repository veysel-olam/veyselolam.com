import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const comments = await prisma.comment.findMany({
    where: { postId: id, approved: true, parentId: null },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { likes: true } },
      replies: {
        where: { approved: true },
        orderBy: { createdAt: "asc" },
        include: { _count: { select: { likes: true } } },
      },
    },
  });

  return NextResponse.json(comments);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { authorName, authorEmail, content, parentId } = await req.json();

  if (!authorName || !authorEmail || !content) {
    return NextResponse.json({ error: "Eksik alan." }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: { postId: id, authorName, authorEmail, content, parentId: parentId ?? null },
  });

  return NextResponse.json(comment, { status: 201 });
}
