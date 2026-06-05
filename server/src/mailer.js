import nodemailer from 'nodemailer';
import { renderAutoReply, renderNotification } from './templates.js';

/**
 * Wraps an SMTP transport. The owner notification must succeed; the visitor's
 * confirmation is best-effort and never fails the request. Pooling suits a
 * long-running server; serverless functions pass `pool: false`.
 */
export function createMailer(config, { transport, pool = true, logger = console } = {}) {
  const transporter =
    transport ??
    nodemailer.createTransport({
      ...config.smtp,
      pool,
      maxConnections: 3,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });

  return {
    verify: () => transporter.verify(),

    close: () => transporter.close?.(),

    /** Resolves with whether the visitor's confirmation email was sent. */
    async sendContact(data, meta) {
      const notification = renderNotification(data, meta);
      await transporter.sendMail({
        from: config.mail.from,
        to: config.mail.to,
        replyTo: { name: data.name, address: data.email },
        subject: notification.subject,
        text: notification.text,
        html: notification.html,
      });

      if (!config.mail.autoReply) return false;

      const reply = renderAutoReply(data, config.owner);
      try {
        await transporter.sendMail({
          from: { name: config.owner.name, address: config.mail.from.address },
          to: { name: data.name, address: data.email },
          replyTo: config.mail.to,
          subject: reply.subject,
          text: reply.text,
          html: reply.html,
          headers: { 'Auto-Submitted': 'auto-replied' },
        });
        return true;
      } catch (error) {
        logger.warn(`[mailer] Confirmation to visitor failed: ${error.message}`);
        return false;
      }
    },
  };
}
