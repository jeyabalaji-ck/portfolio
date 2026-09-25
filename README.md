# Jeya Balaji C K - Portfolio

Personal portfolio of Jeya Balaji C K, Software Engineer (Frontend). A single-page site built with React, TypeScript and SCSS modules.

## Stack

- **React 19 + TypeScript** (strict) on **Vite**
- **SCSS modules** with design tokens exposed as CSS custom properties (light/dark themes)
- **GSAP + ScrollTrigger** (via `@gsap/react`) for the motion system, with **Lenis** smooth scrolling on GSAP's ticker
- **Vitest + Testing Library** for unit tests, **ESLint** (typescript-eslint, react-hooks)
- Self-hosted variable fonts via Fontsource

## Scripts

| Command             | Description                                   |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Start the dev server                          |
| `npm run dev:api`   | Start the contact API (`server/`)             |
| `npm run build`     | Type-check and build for production (`dist/`) |
| `npm run preview`   | Serve the production build locally            |
| `npm run lint`      | Lint the project                              |
| `npm run typecheck` | Type-check app and tooling config             |
| `npm test`          | Run unit tests                                |
| `npm run test:api`  | Run the contact API tests                     |
| `npm run check`     | Type-check, lint and test (site and API)      |

## Structure

```
src/
  components/  layout (header, footer), motion (intro, cursor, scroll progress, chapter cards) and UI primitives (incl. marquee)
  sections/    one folder per page section, each owning its motion (Hero, About, Experience, Stack,
               Process, Projects, Achievements, Education, Services, Contact)
  motion/      GSAP setup, shared eases and media conditions, intro signal, scroll reveals, Lenis smooth scroll
  data/        typed portfolio content - edit copy here, not in components
  hooks/       smooth scroll, scroll lock, scroll reveal, step activation, velocity marquee, magnetic,
               theme, active section, media query, clipboard and scroll direction
  styles/      tokens, mixins and global styles
  services/    API clients (contact form, public GitHub data)
  types/       content types
server/        Express + Nodemailer contact API - see server/README.md
```

## Contact form

The Contact section posts to the Express API in [`server/`](server/README.md), which emails each enquiry with Nodemailer. Validation rules live in `server/src/validation.js` and are mirrored for instant feedback in `src/utils/contactValidation.ts`, so keep the two in sync.

- **Local:** run `npm run dev:api` and `npm run dev` together. Vite proxies `/api` to `localhost:4000`.
- **Production (Vercel):** `api/index.js` runs the same Express app as a serverless function in this project, and `vercel.json` routes `/api/*` to it. The form therefore posts to `/api/contact` on the site's own domain, with no CORS setup and no `VITE_CONTACT_API_URL`. Add the SMTP variables from `server/.env.example` to the Vercel project's environment variables.
- **Elsewhere:** `server/` also runs as a standalone Node server (`npm start`). Build the site with `VITE_CONTACT_API_URL` set to its origin, and add the site URL to its `ALLOWED_ORIGINS`.

## Motion

- Every animation is registered through `gsap.matchMedia()`, so it reverts cleanly on unmount and when a media condition changes.
- Smooth scrolling uses Lenis driven by GSAP's ticker (`src/motion/smoothScroll.ts`). It smooths wheel input only (touch keeps native scrolling), routes in-page anchor links, and is never started with reduced motion. Overlays lock scrolling through `useScrollLock`; scrollable overlays carry `data-lenis-prevent`.
- `prefers-reduced-motion: reduce` disables smooth scrolling, the intro, custom cursor, magnetic effects, parallax, chapter cards, the pinned gallery, marquees and scroll reveals; content is fully visible without them.
- Touch and small screens get lighter motion: no custom cursor, no pointer parallax, no pinned sections (the Work gallery stacks vertically and chapter cards drift instead of holding).
- The Work gallery pins and scrolls horizontally on large screens (`HORIZONTAL` in `useProjectsMotion.ts`, mirrored in `Projects.module.scss`). After lazily loaded content mounts or changes height, triggers are re-sorted by document position and refreshed.
- Elements animated by GSAP never also carry a CSS transition on the same property.
- Sections declare simple reveals in markup with `data-reveal` (`words`, `fade`, `stagger`, `clip`, `line`), plus scrubbed `data-parallax` / `data-drift`; see `src/motion/reveal.ts`.

## GitHub data

The Work section shows public GitHub data (repository count, language mix, recently updated repositories) fetched in the browser from the unauthenticated REST API once the block scrolls near. Results are cached for the session; if the API fails or is rate limited, the block falls back to a link to the GitHub profile.

## Deployment

Set `SITE_URL` (see `.env.example`) at build time to emit `sitemap.xml`, the canonical and Open Graph URL and image-alt tags, and absolute URLs in the structured data (`__SITE_URL__` in `index.html`). `robots.txt` is always generated. The JSON-LD describes a `ProfilePage`, a `WebSite` and a `Person` with a `ContactPoint` for professional enquiries.

Set `VITE_CONTACT_API_URL` to point the contact form at the deployed API. The build also adds a `dns-prefetch` hint for that origin.
