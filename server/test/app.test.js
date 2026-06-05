import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, it } from 'node:test';
import { createApp } from '../src/app.js';

const ORIGIN = 'https://portfolio.test';
const silentLogger = { info() {}, warn() {}, error() {} };

const validBody = {
  name: 'Ada Lovelace',
  email: 'Ada@Example.com',
  company: 'Analytical Engines',
  topic: 'Job opportunity',
  message: 'We would love to talk to you about a frontend role on our team.',
  website: '',
};

describe('contact API', () => {
  let server;
  let baseUrl;
  let sent;
  let failNext;

  before(async () => {
    const mailer = {
      async sendContact(data, meta) {
        if (failNext) {
          failNext = false;
          throw new Error('SMTP down');
        }
        sent.push({ data, meta });
        return true;
      },
    };
    const app = createApp({
      mailer,
      allowedOrigins: [ORIGIN],
      rateLimit: { limit: 6, windowMs: 60_000 },
      logger: silentLogger,
    });
    await new Promise((resolve) => {
      server = app.listen(0, resolve);
    });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  after(() => new Promise((resolve) => server.close(resolve)));

  beforeEach(() => {
    sent = [];
    failNext = false;
  });

  const post = (body, headers = {}) =>
    fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: ORIGIN, ...headers },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });

  it('reports health', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { ok: true, status: 'healthy' });
  });

  it('delivers a valid enquiry with normalised fields', async () => {
    const res = await post(validBody);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), {
      ok: true,
      message: 'Thanks! Your message has been sent.',
      confirmationSent: true,
    });
    assert.equal(res.headers.get('access-control-allow-origin'), ORIGIN);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].data.email, 'ada@example.com');
    assert.equal(sent[0].meta.origin, ORIGIN);
  });

  it('rejects invalid fields with per-field messages', async () => {
    const res = await post({ name: 'A', email: 'not-an-email', message: 'short' });
    const body = await res.json();
    assert.equal(res.status, 400);
    assert.deepEqual(Object.keys(body.fields).sort(), ['email', 'message', 'name']);
    assert.equal(sent.length, 0);
  });

  it('silently drops honeypot submissions', async () => {
    const res = await post({ ...validBody, website: 'https://spam.example' });
    assert.equal(res.status, 200);
    assert.equal(sent.length, 0);
  });

  it('refuses origins that are not allowed', async () => {
    const res = await post(validBody, { Origin: 'https://evil.example' });
    assert.equal(res.status, 403);
    assert.equal(res.headers.get('access-control-allow-origin'), null);
    assert.equal(sent.length, 0);
  });

  it('always accepts requests from its own origin', async () => {
    const res = await post(validBody, { Origin: baseUrl });
    assert.equal(res.status, 200);
    assert.equal(sent.length, 1);
  });

  it('handles malformed JSON', async () => {
    const res = await post('{"name":');
    assert.equal(res.status, 400);
    assert.match((await res.json()).error, /not valid JSON/);
  });

  it('returns 502 when the mail server fails', async () => {
    failNext = true;
    const res = await post(validBody);
    assert.equal(res.status, 502);
    assert.equal((await res.json()).ok, false);
  });

  it('rate limits repeated submissions', async () => {
    let last;
    for (let i = 0; i < 8; i += 1) last = await post(validBody);
    assert.equal(last.status, 429);
    assert.equal((await last.json()).ok, false);
  });
});
