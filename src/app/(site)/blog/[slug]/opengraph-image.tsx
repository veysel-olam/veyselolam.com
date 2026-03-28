import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, summary: true, tags: true, readingTime: true },
  });

  const title = post?.title ?? "Veysel Olam";
  const summary = post?.summary ?? "";
  const tags = post?.tags ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "72px 80px",
          background: "#2B1800",
        }}
      >
        {/* Grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -60,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(196,98,30,0.3) 0%, transparent 70%)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "relative" }}>
          {/* Tags */}
          {tags.length > 0 && (
            <div style={{ display: "flex", gap: 8 }}>
              {tags.slice(0, 3).map((tag) => (
                <div
                  key={tag}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 999,
                    background: "rgba(196,98,30,0.2)",
                    color: "#E8855A",
                    fontSize: 13,
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 50 ? 40 : 48,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              maxWidth: 900,
            }}
          >
            {title}
          </div>

          {/* Summary */}
          {summary && (
            <div
              style={{
                fontSize: 20,
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.5,
                maxWidth: 800,
                display: "-webkit-box",
                overflow: "hidden",
              }}
            >
              {summary.length > 120 ? summary.slice(0, 120) + "…" : summary}
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 8,
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              veyselolam.com
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "linear-gradient(90deg, #C4621E 0%, transparent 60%)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
