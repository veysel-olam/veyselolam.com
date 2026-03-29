import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json([]);

  const posts = await prisma.$queryRaw`
    SELECT slug, title, summary, "publishedAt", tags,
      ts_rank(
        to_tsvector('simple', title || ' ' || summary || ' ' || content),
        plainto_tsquery('simple', ${q})
      ) AS rank
    FROM "Post"
    WHERE published = true
      AND "publishedAt" <= NOW()
      AND to_tsvector('simple', title || ' ' || summary || ' ' || content)
        @@ plainto_tsquery('simple', ${q})
    ORDER BY rank DESC
    LIMIT 10
  `;

  return NextResponse.json(posts);
}
