import Script from "next/script";

export function Analytics() {
  const umamiId = process.env.UMAMI_WEBSITE_ID;
  if (!umamiId) return null;

  return (
    <Script
      async
      src="https://analytics.umami.is/script.js"
      data-website-id={umamiId}
      strategy="afterInteractive"
    />
  );
}
