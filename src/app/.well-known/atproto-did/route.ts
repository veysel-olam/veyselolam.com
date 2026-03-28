import { NextResponse } from "next/server";

export function GET() {
  return new NextResponse("did:plc:27nmkml5e6xkiwnif47sp2vb", {
    headers: { "Content-Type": "text/plain" },
  });
}
