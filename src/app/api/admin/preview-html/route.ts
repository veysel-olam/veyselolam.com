import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { compileMdxContent } from "@/lib/mdx";
import { renderToStaticMarkup } from "react-dom/server";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { content } = await req.json();
  if (!content) return NextResponse.json({ html: "" });

  try {
    const { content: rendered } = await compileMdxContent(content);
    const html = renderToStaticMarkup(rendered as React.ReactElement);
    return NextResponse.json({ html });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "MDX derleme hatası";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
