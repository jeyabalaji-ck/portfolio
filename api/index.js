/**
 * Vercel serverless entry: serves the Express contact API from server/ on the
 * site's own domain, so the form posts to same-origin /api/contact. vercel.json
 * routes every /api/* path here; Express still sees the original URL.
 */
import { createApp } from '../server/src/app.js';
import { loadConfig } from '../server/src/config.js';
import { createMailer } from '../server/src/mailer.js';

const config = loadConfig();

export default createApp({
  // Functions are frozen between requests, so open a fresh SMTP connection each time.
  mailer: createMailer(config, { pool: false }),
  allowedOrigins: config.allowedOrigins,
  // Vercel's edge proxy sits in front of every function.
  trustProxy: 1,
  rateLimit: config.rateLimit,
});
