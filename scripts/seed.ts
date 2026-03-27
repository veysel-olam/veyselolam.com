import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const content = `
Next.js, React tabanlı web uygulamaları geliştirmek için en güçlü frameworklerden biri. Bu yazıda App Router mimarisini, Server Components'ı ve modern deployment pratiklerini ele alıyorum.

## App Router Neden Önemli?

Next.js 13 ile gelen App Router, dosya tabanlı routing anlayışını tamamen yeniden tanımladı. Artık \`pages/\` dizini yerine \`app/\` dizini kullanıyoruz ve her şey Server Component olarak başlıyor.

\`\`\`tsx
// app/blog/page.tsx
export default async function BlogPage() {
  const posts = await getPosts(); // Doğrudan async/await
  return <PostList posts={posts} />;
}
\`\`\`

Server'da çalıştığı için veritabanına doğrudan erişebilir, API katmanına gerek kalmaz.

## Layout Sistemi

\`layout.tsx\` dosyaları, route grupları arasında paylaşılan UI'ları tanımlar. Nested layout'lar sayesinde her segment kendi layout'ını korur.

\`\`\`
app/
  layout.tsx        ← Tüm sayfalar
  (site)/
    layout.tsx      ← Sadece site sayfaları
    page.tsx
    blog/
      [slug]/
        page.tsx
  (admin)/
    layout.tsx      ← Admin sayfaları
\`\`\`

## Server Components vs Client Components

Varsayılan olarak tüm bileşenler Server Component. \`useState\`, \`useEffect\` veya tarayıcı API'larına ihtiyaç duyduğunda \`"use client"\` direktifini eklemen yeterli.

\`\`\`tsx
"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
\`\`\`

## Streaming ile Progressive Loading

React Suspense ile ağır bileşenleri stream edebilirsin. Kullanıcı sayfanın geri kalanını beklemek zorunda kalmaz.

\`\`\`tsx
import { Suspense } from "react";

export default function Page() {
  return (
    <div>
      <StaticContent />
      <Suspense fallback={<Skeleton />}>
        <SlowComponent />
      </Suspense>
    </div>
  );
}
\`\`\`

## Railway ile Deployment

Railway, Next.js uygulamalarını deploy etmek için ideal. \`railway.json\` ile migration ve start komutlarını tanımlayınca her push'ta otomatik deploy oluyor.

\`\`\`json
{
  "deploy": {
    "startCommand": "npx prisma migrate deploy && node .next/standalone/server.js"
  }
}
\`\`\`

## Sonuç

App Router, modern web geliştirme için sağlam bir temel sunuyor. Server Components ile performans, Streaming ile UX ve file-based routing ile geliştirici deneyimi bir arada.
`.trim();

async function main() {
  const existing = await prisma.post.findUnique({ where: { slug: "nextjs-app-router-rehberi" } });
  if (existing) {
    console.log("Yazı zaten mevcut.");
    process.exit(0);
  }

  await prisma.post.create({
    data: {
      slug: "nextjs-app-router-rehberi",
      title: "Next.js App Router: Modern Web Geliştirme Rehberi",
      summary: "App Router mimarisi, Server Components, Streaming ve Railway deployment — Next.js ile modern bir web uygulaması nasıl yapılır?",
      content,
      published: true,
      publishedAt: new Date(),
      readingTime: "5 dk okuma",
      views: 0,
    },
  });

  console.log("✓ Örnek yazı eklendi.");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
