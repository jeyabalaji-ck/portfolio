/**
 * Reads and validates the environment once at startup, so a missing SMTP
 * password fails loudly on boot rather than on the first visitor's submission.
 */

function toBool(value, fallback) {
  if (value === undefined || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
}

function toInt(value, fallback) {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toList(value) {
  return (value ?? '')
    .split(',')
    .map((item) => item.trim().replace(/\/+$/, ''))
    .filter(Boolean);
}

export function loadConfig(env = process.env) {
  const missing = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'MAIL_TO'].filter((key) => !env[key]?.trim());
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}. See server/.env.example.`);
  }

  const smtpPort = toInt(env.SMTP_PORT, 465);
  const isProduction = env.NODE_ENV === 'production';
  // Same-origin requests are always allowed (see app.js); this list is for other sites.
  const allowedOrigins = toList(env.ALLOWED_ORIGINS);

  return {
    port: toInt(env.PORT, 4000),
    isProduction,
    allowedOrigins: allowedOrigins.length > 0 || isProduction ? allowedOrigins : ['http://localhost:5173'],
    trustProxy: toInt(env.TRUST_PROXY, 0),
    smtp: {
      host: env.SMTP_HOST.trim(),
      port: smtpPort,
      secure: toBool(env.SMTP_SECURE, smtpPort === 465),
      auth: { user: env.SMTP_USER.trim(), pass: env.SMTP_PASS },
    },
    mail: {
      to: env.MAIL_TO.trim(),
      from: { name: env.MAIL_FROM_NAME?.trim() || 'Portfolio Contact', address: (env.MAIL_FROM || env.SMTP_USER).trim() },
      autoReply: toBool(env.AUTO_REPLY, true),
    },
    owner: {
      name: env.OWNER_NAME?.trim() || 'Jeya Balaji C K',
      siteUrl: (env.SITE_URL ?? '').trim().replace(/\/+$/, ''),
    },
    rateLimit: {
      limit: toInt(env.RATE_LIMIT_MAX, 5),
      windowMs: toInt(env.RATE_LIMIT_WINDOW_MINUTES, 15) * 60 * 1000,
    },
  };
}
