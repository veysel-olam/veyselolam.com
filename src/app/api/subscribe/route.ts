import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWelcome } from "@/lib/mail";

// In-memory rate limiter: ip → { count, resetAt }
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 saat

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("fly-client-ip") ??
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Çok fazla istek. Bir süre bekle." }, { status: 429 });
    }

    const body = await req.json();

    // Honeypot: botlar bu alanı doldurur, insanlar doldurmaz
    if (body.website) {
      return NextResponse.json({ status: "subscribed" }); // bot'a başarılı gibi göster
    }

    const { email } = body;
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "E-posta gerekli." }, { status: 400 });
    }

    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ status: "already_subscribed" });

    const subscriber = await prisma.subscriber.create({ data: { email, confirmed: true } });
    await sendWelcome({ email, subscriberId: subscriber.id });
    return NextResponse.json({ status: "subscribed" });
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}
