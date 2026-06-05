/**
 * Email bodies. HTML uses tables and inline styles because most mail clients
 * ignore <style> blocks; every value from the visitor is escaped.
 */

const COLORS = {
  bg: '#f3f1ec',
  card: '#fbfaf7',
  text: '#111110',
  muted: '#4a4843',
  faint: '#6b6861',
  border: '#e2dfd8',
  accent: '#d9461c',
};

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(date);
}

function layout({ preheader, eyebrow, title, body, footer }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${COLORS.card};border:1px solid ${COLORS.border};border-radius:16px;font-family:${FONT};color:${COLORS.text};">
        <tr>
          <td style="padding:32px 32px 0;">
            <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.accent};font-weight:600;">${escapeHtml(eyebrow)}</p>
            <h1 style="margin:0;font-size:24px;line-height:1.25;letter-spacing:-0.02em;font-weight:650;">${escapeHtml(title)}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 32px;font-size:15px;line-height:1.6;">
            ${body}
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;border-top:1px solid ${COLORS.border};font-size:12px;line-height:1.6;color:${COLORS.faint};">
            ${footer}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

function detailRow(label, value) {
  return `<tr>
  <td style="padding:10px 0;border-bottom:1px solid ${COLORS.border};width:110px;vertical-align:top;font-size:13px;color:${COLORS.faint};">${escapeHtml(label)}</td>
  <td style="padding:10px 0;border-bottom:1px solid ${COLORS.border};vertical-align:top;font-size:15px;color:${COLORS.text};">${value}</td>
</tr>`;
}

function button(href, label) {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 22px;border-radius:999px;background:${COLORS.text};color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">${escapeHtml(label)}</a>`;
}

/** The enquiry as delivered to the portfolio owner. */
export function renderNotification(data, { receivedAt = new Date(), origin = '' } = {}) {
  const subject = `New enquiry: ${data.topic} - ${data.name}`;
  const replyHref = `mailto:${data.email}?subject=${encodeURIComponent(`Re: ${data.topic}`)}`;
  const received = formatDate(receivedAt);

  const text = [
    `New portfolio enquiry`,
    ``,
    `Name:    ${data.name}`,
    `Email:   ${data.email}`,
    ...(data.company ? [`Company: ${data.company}`] : []),
    `Topic:   ${data.topic}`,
    ``,
    data.message,
    ``,
    `--`,
    `Received ${received} IST${origin ? ` via ${origin}` : ''}.`,
    `Reply to this email to respond directly.`,
  ].join('\n');

  const html = layout({
    preheader: `${data.name}: ${data.message.slice(0, 120)}`,
    eyebrow: 'New portfolio enquiry',
    title: data.topic,
    body: `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        ${detailRow('Name', escapeHtml(data.name))}
        ${detailRow('Email', `<a href="mailto:${escapeHtml(data.email)}" style="color:${COLORS.accent};text-decoration:none;">${escapeHtml(data.email)}</a>`)}
        ${data.company ? detailRow('Company', escapeHtml(data.company)) : ''}
        ${detailRow('Topic', escapeHtml(data.topic))}
      </table>
      <p style="margin:0 0 8px;font-size:13px;color:${COLORS.faint};">Message</p>
      <div style="margin:0 0 28px;padding:18px 20px;border-left:3px solid ${COLORS.accent};background:${COLORS.bg};border-radius:4px 12px 12px 4px;white-space:pre-wrap;word-break:break-word;">${escapeHtml(data.message)}</div>
      ${button(replyHref, `Reply to ${data.name.split(' ')[0]}`)}`,
    footer: `Received ${escapeHtml(received)} IST${origin ? ` via ${escapeHtml(origin)}` : ''}. Replying to this email goes straight to the sender.`,
  });

  return { subject, text, html };
}

/** A short confirmation sent to the visitor. It deliberately does not echo their message back. */
export function renderAutoReply(data, owner) {
  const firstName = data.name.split(' ')[0];
  const subject = `Thanks for getting in touch, ${firstName}`;
  const signoff = owner.siteUrl ? `${owner.name}\n${owner.siteUrl}` : owner.name;

  const text = [
    `Hi ${firstName},`,
    ``,
    `Thanks for reaching out about "${data.topic}". Your message has reached me and I'll reply personally as soon as I can.`,
    ``,
    `If anything is time-sensitive, just reply to this email.`,
    ``,
    `Best regards,`,
    signoff,
  ].join('\n');

  const html = layout({
    preheader: 'Your message has been received - I will reply personally soon.',
    eyebrow: 'Message received',
    title: `Thanks for getting in touch, ${firstName}.`,
    body: `
      <p style="margin:0 0 16px;color:${COLORS.muted};">Thanks for reaching out about <strong style="color:${COLORS.text};">${escapeHtml(data.topic)}</strong>. Your message has reached me and I'll reply personally as soon as I can.</p>
      <p style="margin:0 0 24px;color:${COLORS.muted};">If anything is time-sensitive, just reply to this email.</p>
      <p style="margin:0;color:${COLORS.text};">Best regards,<br><strong>${escapeHtml(owner.name)}</strong></p>
      ${owner.siteUrl ? `<p style="margin:24px 0 0;">${button(owner.siteUrl, 'Visit portfolio')}</p>` : ''}`,
    footer: `You're receiving this because this address was used on the contact form at ${escapeHtml(owner.siteUrl || 'my portfolio')}. If that wasn't you, you can safely ignore this email.`,
  });

  return { subject, text, html };
}
