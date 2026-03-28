import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const ADMIN_EMAIL = "veysel.olam@hotmail.com";
const FROM = "blog@veyselolam.com";
const FROM_NEWSLETTER = "bulten@veyselolam.com";

function unsubscribeUrl(siteUrl: string, subscriberId: string) {
  return `${siteUrl}/api/unsubscribe?id=${subscriberId}`;
}

function unsubscribeFooter(siteUrl: string, subscriberId: string) {
  const url = unsubscribeUrl(siteUrl, subscriberId);
  return `
    <hr style="border:none;border-top:1px solid #e0e0e0;margin:0 0 16px">
    <p style="font-size:12px;color:#888;margin:0">
      Bu e-postayı <a href="${siteUrl}" style="color:#C4621E;text-decoration:none">veyselolam.com</a> üzerinden aldınız.
      &nbsp;·&nbsp;
      <a href="${url}" style="color:#888;text-decoration:underline">Abonelikten çık</a>
    </p>
  `;
}

export async function sendCommentNotification({
  postTitle,
  postSlug,
  authorName,
  authorEmail,
  content,
}: {
  postTitle: string;
  postSlug: string;
  authorName: string;
  authorEmail: string;
  content: string;
}) {
  if (!resend) return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://veyselolam.com";
  const postUrl = `${siteUrl}/blog/${postSlug}`;
  const adminUrl = `${siteUrl}/admin/comments`;

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `Yeni yorum: ${postTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;color:#1a1a1a">
        <p style="margin:0 0 16px"><strong>${authorName}</strong> <span style="color:#888">(${authorEmail})</span> yorum bıraktı:</p>
        <blockquote style="margin:0 0 16px;padding:12px 16px;border-left:3px solid #e0e0e0;color:#444;background:#f9f9f9;border-radius:4px">
          ${content}
        </blockquote>
        <p style="margin:0;font-size:13px">
          <a href="${postUrl}" style="color:#C4621E;text-decoration:none">Yazıya git</a>
          &nbsp;·&nbsp;
          <a href="${adminUrl}" style="color:#C4621E;text-decoration:none">Admin paneli</a>
        </p>
      </div>
    `,
  }).catch(() => {});
}

export async function sendWelcome({
  email,
  subscriberId,
}: {
  email: string;
  subscriberId: string;
}) {
  if (!resend) return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://veyselolam.com";
  const unsubUrl = unsubscribeUrl(siteUrl, subscriberId);

  await resend.emails.send({
    from: FROM_NEWSLETTER,
    to: email,
    subject: "Bültene hoş geldin",
    headers: {
      "List-Unsubscribe": `<${unsubUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#1a1a1a">
        <h2 style="font-size:18px;font-weight:600;margin:0 0 12px">Abone oldun</h2>
        <p style="font-size:15px;line-height:1.7;color:#333;margin:0 0 24px">
          Yeni yazılardan haberdar olacaksın. Sık sık değil, ama değerli olduğunda.
        </p>
        ${unsubscribeFooter(siteUrl, subscriberId)}
      </div>
    `,
  }).catch(() => {});
}

export async function sendNewsletter({
  subject,
  title,
  content,
  recipients,
}: {
  subject: string;
  title: string;
  content: string;
  recipients: { id: string; email: string }[];
}) {
  if (!resend || recipients.length === 0) return { sent: 0, failed: 0 };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://veyselolam.com";

  const batches: { id: string; email: string }[][] = [];
  for (let i = 0; i < recipients.length; i += 50) {
    batches.push(recipients.slice(i, i + 50));
  }

  let sent = 0;
  let failed = 0;

  for (const batch of batches) {
    const results = await Promise.allSettled(
      batch.map(({ id, email }) => {
        const unsubUrl = unsubscribeUrl(siteUrl, id);
        const html = `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
            <h2 style="font-size:20px;font-weight:600;margin:0 0 16px">${title}</h2>
            <div style="font-size:15px;line-height:1.7;color:#333;margin:0 0 32px">
              ${content.replace(/\n/g, "<br>")}
            </div>
            ${unsubscribeFooter(siteUrl, id)}
          </div>
        `;
        return resend!.emails.send({
          from: FROM_NEWSLETTER,
          to: email,
          subject,
          headers: {
            "List-Unsubscribe": `<${unsubUrl}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
          html,
        });
      })
    );
    results.forEach((r) => (r.status === "fulfilled" ? sent++ : failed++));
  }

  return { sent, failed };
}
