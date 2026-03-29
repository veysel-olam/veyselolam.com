import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
}

export async function GET() {
  try {
    await requireAdmin();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const series = await (prisma as any).series.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(series);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const { title, slug, description } = await req.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const series = await (prisma as any).series.create({ data: { title, slug, description } });
    return NextResponse.json(series, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error";
    if (message === "Unauthorized") return NextResponse.json({ error: message }, { status: 401 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
