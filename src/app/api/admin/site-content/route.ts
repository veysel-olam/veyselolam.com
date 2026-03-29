import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const key = req.nextUrl.searchParams.get("key") ?? "hakkimda";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = await (prisma as any).siteContent.findUnique({ where: { key } }) as { value: string } | null;
    return NextResponse.json({ value: content?.value ?? "" });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const { key, value } = await req.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = await (prisma as any).siteContent.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    return NextResponse.json(content);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error";
    if (message === "Unauthorized") return NextResponse.json({ error: message }, { status: 401 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
