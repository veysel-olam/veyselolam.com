import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendCommentNotification, sendReplyNotification } from "@/lib/mail";

const commentRateLimit = new Map<string, { count: number; resetAt: number }>();
const COMMENT_LIMIT = 5;
const COMMENT_WINDOW_MS = 60 * 60 * 1000; // 1 saat

function checkCommentRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = commentRateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    commentRateLimit.set(ip, { count: 1, resetAt: now + COMMENT_WINDOW_MS });
    return true;
  }
  if (entry.count >= COMMENT_LIMIT) return false;
  entry.count++;
  return true;
}

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
  const ip = req.headers.get("fly-client-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkCommentRateLimit(ip)) {
    return NextResponse.json({ error: "Çok fazla yorum. Bir süre bekle." }, { status: 429 });
  }

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

  if (parentId && post) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentId },
      select: { authorName: true, authorEmail: true },
    });
    if (parentComment && parentComment.authorEmail !== authorEmail) {
      sendReplyNotification({
        parentAuthorName: parentComment.authorName,
        parentAuthorEmail: parentComment.authorEmail,
        replyAuthorName: authorName,
        content,
        postTitle: post.title,
        postSlug: post.slug,
      });
    }
  }

  return NextResponse.json(comment, { status: 201 });
}
