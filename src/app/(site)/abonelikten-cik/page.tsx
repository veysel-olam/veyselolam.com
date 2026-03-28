import Link from "next/link";

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ durum?: string }>;
}) {
  const { durum } = await searchParams;
  const success = durum === "basarili";

  return (
    <main className="max-w-xl mx-auto px-6 pt-32 pb-32">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-6">
        Abonelik
      </p>
      {success ? (
        <>
          <h1 className="text-xl font-semibold tracking-tight mb-3">Abonelikten çıkıldı.</h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            Artık bülten almayacaksın. Tekrar abone olmak istersen yazılar sayfasından yapabilirsin.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-xl font-semibold tracking-tight mb-3">Geçersiz link.</h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            Bu link geçersiz ya da süresi dolmuş olabilir.
          </p>
        </>
      )}
      <Link
        href="/"
        className="inline-block mt-8 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Ana sayfa
      </Link>
    </main>
  );
}
