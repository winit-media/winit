interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

interface SiteContactDetails {
  contactPhone: string;
  contactAddress: string;
  contactEmail: string;
  footerTitle: string;
  footerCopyright: string;
}

const BRAND_COLOR = "#912dbf";
const BRAND_DARK = "#7a24a8";
const BRAND_LIGHT = "#a84fd4";

const patternSvgBase64 = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 810 810"><rect width="810" height="810" fill="none"/><path fill="#912dbf" fill-opacity="0.06" d="M405 0C181.5 0 0 181.5 0 405s181.5 405 405 405 405-181.5 405-405S628.5 0 405 0zm0 720C210.15 720 90 599.85 90 405S210.15 90 405 90s315 120.15 315 315-120.15 315-315 315z"/></svg>`)})")`;

function emailWrapper(children: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WiNit Media</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          ${children}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function headerBar(): string {
  return `
<tr>
  <td style="background:linear-gradient(135deg,${BRAND_COLOR} 0%,${BRAND_DARK} 100%);padding:32px 40px;border-radius:16px 16px 0 0;text-align:center;">
    <img src="https://winitmedia.com/logo.png" alt="WiNit" width="120" style="display:block;margin:0 auto 16px;max-width:120px;height:auto;" />
    <div style="width:40px;height:3px;background:rgba(255,255,255,0.4);border-radius:2px;margin:0 auto;"></div>
  </td>
</tr>`;
}

function footerBar(siteDetails: SiteContactDetails): string {
  return `
<tr>
  <td style="background:linear-gradient(135deg,${BRAND_DARK} 0%,${BRAND_COLOR} 100%);padding:28px 40px;border-radius:0 0 16px 16px;text-align:center;">
    <p style="margin:0 0 8px;color:rgba(255,255,255,0.9);font-size:13px;line-height:1.6;">
      ${siteDetails.contactPhone} &nbsp;|&nbsp; ${siteDetails.contactEmail}
    </p>
    <p style="margin:0;color:rgba(255,255,255,0.5);font-size:11px;">
      ${siteDetails.footerCopyright}
    </p>
  </td>
</tr>`;
}

export function visitorAutoResponseTemplate(
  data: ContactFormData,
  siteDetails: SiteContactDetails
): { subject: string; html: string } {
  const subject = `Thank you for reaching out, ${data.name}!`;

  const html = emailWrapper(`
    ${headerBar()}
    <tr>
      <td style="background-color:#ffffff;padding:40px;border:1px solid #e5e7eb;border-top:none;">
        <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;">
          Hi ${data.name},
        </h1>
        <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
          Thank you for contacting <strong style="color:${BRAND_COLOR};">WiNit Media</strong>! We&apos;ve received your message and our team will get back to you within <strong>24 hours</strong>.
        </p>

        <div style="background-color:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
          <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:${BRAND_COLOR};text-transform:uppercase;letter-spacing:0.05em;">
            Your Message
          </p>
          <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;white-space:pre-wrap;">
            ${data.message}
          </p>
        </div>

        <div style="background-color:#f9fafb;border-radius:12px;padding:20px 24px;margin-bottom:8px;">
          <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">
            Need immediate assistance?
          </p>
          <p style="margin:0 0 6px;font-size:13px;color:#374151;">
            &#128231;&nbsp; <a href="mailto:${siteDetails.contactEmail}" style="color:${BRAND_COLOR};text-decoration:none;">${siteDetails.contactEmail}</a>
          </p>
          <p style="margin:0 0 6px;font-size:13px;color:#374151;">
            &#128241;&nbsp; ${siteDetails.contactPhone}
          </p>
          <p style="margin:0;font-size:13px;color:#374151;">
            &#128205;&nbsp; ${siteDetails.contactAddress}
          </p>
        </div>
      </td>
    </tr>
    ${footerBar(siteDetails)}
  `);

  return { subject, html };
}

export function adminNotificationTemplate(
  data: ContactFormData,
  siteDetails: SiteContactDetails
): { subject: string; html: string } {
  const subject = `New contact form submission from ${data.name}`;

  const phoneRow = data.phone
    ? `<tr>
        <td style="padding:12px 20px;border-bottom:1px solid #f3f4f6;">
          <span style="font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;">Phone</span><br/>
          <span style="font-size:14px;color:#111827;">${data.phone}</span>
        </td>
      </tr>`
    : "";

  const html = emailWrapper(`
    ${headerBar()}
    <tr>
      <td style="background-color:#ffffff;padding:40px;border:1px solid #e5e7eb;border-top:none;">
        <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:${BRAND_COLOR};text-transform:uppercase;letter-spacing:0.05em;">
          New Submission
        </p>
        <h1 style="margin:0 0 24px;font-size:22px;font-weight:700;color:#111827;">
          ${data.name} sent you a message
        </h1>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;overflow:hidden;margin-bottom:24px;">
          <tr>
            <td style="padding:12px 20px;border-bottom:1px solid #f3f4f6;">
              <span style="font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;">Name</span><br/>
              <span style="font-size:14px;color:#111827;font-weight:600;">${data.name}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 20px;border-bottom:1px solid #f3f4f6;">
              <span style="font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;">Email</span><br/>
              <a href="mailto:${data.email}" style="font-size:14px;color:${BRAND_COLOR};text-decoration:none;">${data.email}</a>
            </td>
          </tr>
          ${phoneRow}
          <tr>
            <td style="padding:12px 20px;">
              <span style="font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;">Message</span><br/>
              <span style="font-size:14px;color:#111827;line-height:1.6;white-space:pre-wrap;">${data.message}</span>
            </td>
          </tr>
        </table>

        <a href="mailto:${data.email}?subject=Re: Your message to WiNit Media" style="display:inline-block;background:linear-gradient(135deg,${BRAND_COLOR} 0%,${BRAND_DARK} 100%);color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:12px;">
          Reply to ${data.name.split(" ")[0]}
        </a>
      </td>
    </tr>
    ${footerBar(siteDetails)}
  `);

  return { subject, html };
}
