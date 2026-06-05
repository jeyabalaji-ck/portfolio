# Portfolio contact API

A small Express + Nodemailer service that receives the portfolio's contact form and delivers each enquiry by email.

- `POST /api/contact` validates the enquiry, emails it to you with **Reply-To** set to the visitor, and optionally sends the visitor a short confirmation.
- `GET /api/health` returns `{ "ok": true }` for uptime checks.

It includes CORS limited to your site, rate limiting per IP (5 per 15 minutes by default), a honeypot field for bots, Helmet security headers, a 16 KB body limit, and HTML emails with a plain-text version.

## Setup

```bash
cd server
npm install
cp .env.example .env   # then fill in the SMTP details
npm run dev            # http://localhost:4000, restarts on change
```

Then run the site from the repo root with `npm run dev`. Vite forwards `/api` to `localhost:4000`, so the form works locally with no extra config.

### Gmail

1. Turn on 2-Step Verification for the Google account.
2. Create an **App Password** at <https://myaccount.google.com/apppasswords>.
3. Set `SMTP_USER` to the Gmail address, `SMTP_PASS` to the 16-character app password, and `MAIL_FROM` to the same address.

Any other SMTP provider works too (Zoho, Outlook, Brevo, Resend SMTP, and so on). Set `SMTP_HOST`, `SMTP_PORT` and `SMTP_SECURE` to match.

## Environment

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` | yes | | SMTP credentials |
| `MAIL_TO` | yes | | Inbox that receives enquiries |
| `ALLOWED_ORIGINS` | | `http://localhost:5173` in dev | Extra site origins allowed to post (the API's own origin is always allowed) |
| `SMTP_PORT` / `SMTP_SECURE` | | `465` / `true` on port 465 | Use `587` with `SMTP_SECURE=false` for STARTTLS |
| `MAIL_FROM` / `MAIL_FROM_NAME` | | `SMTP_USER` / `Portfolio Contact` | Sender of the notification |
| `AUTO_REPLY` | | `true` | Email the visitor a "message received" confirmation |
| `OWNER_NAME`, `SITE_URL` | | | Signature and link in the confirmation |
| `TRUST_PROXY` | | `0` | Number of proxies in front of the app (set `1` on most hosts) |
| `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MINUTES` | | `5`, `15` | Submissions allowed per IP per window |
| `PORT` | | `4000` | HTTP port |

The server checks the SMTP login at startup and logs the result, so a wrong password shows up at startup, not on the first real enquiry.

## API

```http
POST /api/contact
Content-Type: application/json

{ "name": "Ada Lovelace", "email": "ada@example.com", "company": "", "topic": "Job opportunity",
  "message": "At least 20 characters…", "website": "" }
```

| Status | Body |
| --- | --- |
| `200` | `{ "ok": true, "message": "Thanks! Your message has been sent." }` |
| `400` | `{ "ok": false, "error": "...", "fields": { "email": "Please enter a valid email address." } }` |
| `403` / `413` / `415` | Origin not allowed / body too large / body is not JSON |
| `429` | Rate limit reached |
| `502` | The mail server rejected or could not be reached |

`website` is the honeypot. If it has a value, the API returns success and discards the message.

## Deploying

### Vercel (with the site)

The repo root's `api/index.js` wraps this app as a Vercel serverless function, and `vercel.json` sends `/api/*` to it and installs this folder's dependencies. Deploying the portfolio therefore deploys the API as well. In **Vercel → Project → Settings → Environment Variables**, add `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_TO`, `MAIL_FROM`, `MAIL_FROM_NAME`, `OWNER_NAME`, `SITE_URL` and `AUTO_REPLY`, then redeploy. Requests from the site's own domain are always allowed, so `ALLOWED_ORIGINS` is optional.

### Any Node host

This is also a standard long-running Node server (Node 20.12+). It runs on Render, Railway, Fly.io or a VPS:

- **Start command:** `npm start` (root directory `server`)
- **Environment:** set the variables above, `NODE_ENV=production`, `TRUST_PROXY=1`, and `ALLOWED_ORIGINS=https://jeyabalaji.vercel.app`
- **Health check path:** `/api/health`

Then build the site with `VITE_CONTACT_API_URL` set to the API's public origin (for example `https://your-api.onrender.com`).

## Tests

```bash
npm test   # node:test - API routes, validation, templates and mailer (no network needed)
```
