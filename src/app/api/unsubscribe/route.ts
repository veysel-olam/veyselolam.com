import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.redirect(new URL("/abonelikten-cik?durum=gecersiz", req.url));

  try {
    await prisma.subscriber.delete({ where: { id } });
  } catch {
    // Zaten silinmiş ya da bulunamadı
  }

  return NextResponse.redirect(new URL("/abonelikten-cik?durum=basarili", req.url));
}
