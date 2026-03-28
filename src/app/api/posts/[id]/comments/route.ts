import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendCommentNotification } from "@/lib/mail";

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

  const [comment, post] = await Promise.all([
    prisma.comment.create({
      data: { postId: id, authorName, authorEmail, content, parentId: parentId ?? null },
    }),
    prisma.post.findUnique({
      where: { id },
      select: { title: true, slug: true },
    }),
  ]);

  if (post) {
    sendCommentNotification({
      postTitle: post.title,
      postSlug: post.slug,
      authorName,
      authorEmail,
      content,
    });
  }

  return NextResponse.json(comment, { status: 201 });
}
