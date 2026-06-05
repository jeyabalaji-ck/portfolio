import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { validateContact } from './validation.js';

/**
 * Builds the Express app. Dependencies are injected so tests can run it with a
 * fake mailer and no network access.
 *
 * @param {{
 *   mailer: { sendContact: (data: object, meta: object) => Promise<boolean> },
 *   allowedOrigins: string[],
 *   trustProxy?: number,
 *   rateLimit?: { limit: number, windowMs: number },
 *   logger?: Pick<Console, 'info' | 'warn' | 'error'>,
 * }} options
 */
export function createApp({
  mailer,
  allowedOrigins,
  trustProxy = 0,
  rateLimit: limits = { limit: 5, windowMs: 15 * 60 * 1000 },
  logger = console,
}) {
  const app = express();
  const origins = new Set(allowedOrigins);

  app.disable('x-powered-by');
  app.set('trust proxy', trustProxy);
  app.use(helmet());
  // Allowed: no Origin (curl, health checks), the API's own origin (site and API
  // deployed together) and the configured list (site hosted elsewhere).
  const isAllowedOrigin = (req) => {
    const origin = req.get('origin');
    if (!origin || origins.has(origin)) return true;
    try {
      return new URL(origin).host === req.get('host');
    } catch {
      return false;
    }
  };

  app.use(
    cors((req, callback) =>
      callback(null, {
        origin: isAllowedOrigin(req),
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        maxAge: 86_400,
      }),
    ),
  );
  app.use(express.json({ limit: '16kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, status: 'healthy' });
  });

  const contactLimiter = rateLimit({
    windowMs: limits.windowMs,
    limit: limits.limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
      ok: false,
      error: 'Too many messages from this connection. Please wait a few minutes or email me directly.',
    },
  });

  app.post('/api/contact', contactLimiter, async (req, res, next) => {
    // Browsers always send Origin on POSTs; refuse sites that aren't ours.
    const origin = req.get('origin');
    if (!isAllowedOrigin(req)) {
      return res.status(403).json({ ok: false, error: 'This origin is not allowed to send messages.' });
    }

    if (!req.is('application/json')) {
      return res.status(415).json({ ok: false, error: 'Send the message as JSON.' });
    }

    const result = validateContact(req.body);
    if (!result.ok) {
      return res.status(400).json({
        ok: false,
        error: 'Please check the highlighted fields.',
        fields: result.errors,
      });
    }

    // Pretend success so bots learn nothing from the response.
    if (result.isSpam) {
      logger.info('[contact] Honeypot triggered; message discarded.');
      return res.json({ ok: true, message: 'Thanks! Your message has been sent.', confirmationSent: true });
    }

    try {
      const confirmationSent = await mailer.sendContact(result.data, { receivedAt: new Date(), origin: origin ?? '' });
      logger.info(`[contact] Enquiry delivered (topic: ${result.data.topic}, confirmation: ${confirmationSent}).`);
      return res.json({ ok: true, message: 'Thanks! Your message has been sent.', confirmationSent });
    } catch (error) {
      return next(error);
    }
  });

  app.use((_req, res) => {
    res.status(404).json({ ok: false, error: 'Not found.' });
  });

  // Express recognises error handlers by their four-argument signature.
  // eslint-disable-next-line no-unused-vars
  app.use((error, _req, res, _next) => {
    if (error.type === 'entity.parse.failed') {
      return res.status(400).json({ ok: false, error: 'The request body is not valid JSON.' });
    }
    if (error.type === 'entity.too.large') {
      return res.status(413).json({ ok: false, error: 'The message is too large.' });
    }

    logger.error('[contact] Failed to send enquiry:', error);
    return res.status(502).json({
      ok: false,
      error: 'The message could not be delivered right now. Please try again shortly or email me directly.',
    });
  });

  return app;
}
