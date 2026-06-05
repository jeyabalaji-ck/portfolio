import { createApp } from './app.js';
import { loadConfig } from './config.js';
import { createMailer } from './mailer.js';

// Load server/.env when present; hosting platforms provide real environment variables instead.
try {
  process.loadEnvFile(new URL('../.env', import.meta.url));
} catch {
  // No .env file - rely on the environment.
}

let config;
try {
  config = loadConfig();
} catch (error) {
  console.error(`[config] ${error.message}`);
  process.exit(1);
}

const mailer = createMailer(config);
const app = createApp({
  mailer,
  allowedOrigins: config.allowedOrigins,
  trustProxy: config.trustProxy,
  rateLimit: config.rateLimit,
});

const server = app.listen(config.port, () => {
  console.info(`[server] Contact API listening on http://localhost:${config.port}`);
  console.info(`[server] Allowed origins: ${config.allowedOrigins.join(', ')}`);
});

// Check SMTP credentials up front so a bad password shows in the logs immediately.
mailer
  .verify()
  .then(() => console.info(`[mailer] SMTP connection to ${config.smtp.host} verified.`))
  .catch((error) => console.error(`[mailer] SMTP verification failed: ${error.message}`));

function shutdown(signal) {
  console.info(`[server] ${signal} received, shutting down.`);
  server.close(() => {
    mailer.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
