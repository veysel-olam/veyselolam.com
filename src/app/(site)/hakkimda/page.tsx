import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ben Kimim",
  description: "Veysel Olam — yazılım geliştirici, yazar.",
};

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const BlueSkyIcon = () => (
  <svg viewBox="0 0 568 501" fill="currentColor" className="w-4 h-4">
    <path d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 407.485 459.89 491.577c-71.516 80.569-130.05 32.025-173.89-32.564-43.84 64.589-102.374 113.133-173.89 32.564-76.554-84.092-47.332-167.777 66.543-187.327-65.72 11.185-139.6-7.295-159.875-79.748C12.945 203.66 3 75.293 3 57.947 3-28.906 79.134-1.611 123.121 33.664Z" />
  </svg>
);

const LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/veysel-olam",
    icon: <GitHubIcon />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/veyselolam",
    icon: <LinkedInIcon />,
  },
  {
    label: "Bluesky",
    href: "https://bsky.app/profile/veyselolam.com",
    icon: <BlueSkyIcon />,
  },
];

const STACK = [
  "TypeScript", "React", "Next.js",
  "Node.js", "PostgreSQL", "Prisma",
  "Tailwind CSS",
];

export default function AboutPage() {
  return (
    <main className="max-w-xl mx-auto px-6 pt-24 pb-32">
      <div className="mb-10">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Ben Kimim
        </span>
      </div>

      <div className="space-y-10">
        {/* Tanıtım */}
        <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
          <p>
            Ben Veysel. Yazılım geliştirici; web uygulamaları ve ürünler üzerine çalışıyorum.
          </p>
          <p>
            Yazılımın yanı sıra antropoloji, sosyoloji ve genel olarak insan üzerine
            düşünmeyi seviyorum. Teknolojinin toplumla kesiştiği noktalar, sistemlerin
            nasıl çalıştığı ve neden öyle çalıştığı ilgimi çeken sorular.
          </p>
          <p>
            Bu site, her iki alandaki gözlemlerimi ve düşüncelerimi yazdığım kişisel
            blogum. Bazen teknik, bazen değil.
          </p>
        </div>

        {/* Teknoloji */}
        <div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest block mb-4">
            Teknoloji
          </span>
          <div className="flex flex-wrap gap-2">
            {STACK.map((item) => (
              <span
                key={item}
                className="px-3 py-1 rounded-full text-[13px] text-muted-foreground"
                style={{ border: "1px solid var(--color-border)" }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Bağlantılar */}
        <div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest block mb-4">
            Bağlantılar
          </span>
          <div className="flex gap-3">
            {LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                style={{ border: "1px solid var(--color-border)" }}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
