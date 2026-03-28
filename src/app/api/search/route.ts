import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) return NextResponse.json([]);

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
        { tags: { hasSome: [q.toLowerCase()] } },
      ],
    },
    orderBy: { publishedAt: "desc" },
    take: 8,
    select: { slug: true, title: true, summary: true, tags: true, publishedAt: true },
  });

  return NextResponse.json(posts);
}
