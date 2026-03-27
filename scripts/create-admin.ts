/**
 * Admin kullanıcısı oluşturur.
 * Kullanım: npx tsx scripts/create-admin.ts
 * 
 * .env dosyasında DATABASE_URL ve BETTER_AUTH_SECRET tanımlı olmalı.
 */
import { auth } from "../src/lib/auth";

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@veyselolam.com";
  const password = process.env.ADMIN_PASSWORD ?? "changeme123";
  const name = process.env.ADMIN_NAME ?? "Veysel Olam";

  console.log(`Admin kullanıcısı oluşturuluyor: ${email}`);

  try {
    await auth.api.signUpEmail({
      body: { email, password, name },
    });
    console.log("✓ Admin kullanıcısı başarıyla oluşturuldu.");
    console.log(`  E-posta: ${email}`);
    console.log(`  Şifre:   ${password}`);
    console.log("\n⚠ Lütfen şifreyi üretimde değiştir!");
  } catch (err) {
    console.error("Hata:", err);
  }

  process.exit(0);
}

main();
