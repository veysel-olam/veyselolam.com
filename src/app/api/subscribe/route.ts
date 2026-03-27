import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "E-posta gerekli." }, { status: 400 });

    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ status: "already_subscribed" });

    await prisma.subscriber.create({ data: { email, confirmed: true } });
    return NextResponse.json({ status: "subscribed" });
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}
