-- Series tablosu
CREATE TABLE "Series" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Series_slug_key" ON "Series"("slug");

-- Post tablosuna seri alanları
ALTER TABLE "Post" ADD COLUMN "seriesId" TEXT;
ALTER TABLE "Post" ADD COLUMN "seriesOrder" INTEGER;
ALTER TABLE "Post" ADD CONSTRAINT "Post_seriesId_fkey"
  FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "Post_seriesId_idx" ON "Post"("seriesId");

-- SiteContent tablosu (hakkimda gibi dinamik içerikler)
CREATE TABLE "SiteContent" (
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL DEFAULT '',
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("key")
);

-- Hakkımda için başlangıç verisi
INSERT INTO "SiteContent" ("key", "value", "updatedAt") VALUES (
  'hakkimda',
  'Ben Veysel. Yazılım geliştirici; web uygulamaları ve ürünler üzerine çalışıyorum.

Yazılımın yanı sıra antropoloji, sosyoloji ve genel olarak insan üzerine düşünmeyi seviyorum. Teknolojinin toplumla kesiştiği noktalar, sistemlerin nasıl çalıştığı ve neden öyle çalıştığı ilgimi çeken sorular.

Bu site, her iki alandaki gözlemlerimi ve düşüncelerimi yazdığım kişisel blogum. Bazen teknik, bazen değil.',
  NOW()
);
