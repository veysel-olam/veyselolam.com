import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ben Kimim",
  description: "Veysel Olam hakkında",
};

export default function AboutPage() {
  return (
    <main className="max-w-xl mx-auto px-6 pt-24 pb-32">
      <div className="mb-10">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Ben Kimim
        </span>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Merhaba, ben Veysel. Yazılım geliştirici olarak çalışıyorum.
        </p>
        <p>
          Teknoloji, yazılım ve dünyada olup bitenler üzerine yazıyorum. Bu site
          kişisel blogum; düşüncelerimi, öğrendiklerimi ve ilginç bulduğum
          şeyleri paylaşmak için kullanıyorum.
        </p>
      </div>
    </main>
  );
}
