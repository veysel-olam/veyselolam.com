import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const ADMIN_EMAIL = "veysel.olam@hotmail.com";
const FROM = "blog@veyselolam.com";

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
  }).catch(() => {
    // Mail hatası site işleyişini engellemesin
  });
}
