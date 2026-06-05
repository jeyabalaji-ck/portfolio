import react from '@vitejs/plugin-react';
import { loadEnv, type HtmlTagDescriptor, type Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

const OG_IMAGE_ALT = 'Jeya Balaji C K - Frontend Developer building with React and TypeScript';

/** Returns the origin of an absolute URL, or undefined for relative/empty values. */
function originOf(url: string | undefined): string | undefined {
  try {
    return url ? new URL(url).origin : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Emits robots.txt on every build. When `SITE_URL` is set (see .env.example) it
 * also emits sitemap.xml and injects the canonical URL and absolute Open Graph
 * image tags, which crawlers require to be fully qualified. `__SITE_URL__` in
 * index.html (used by the structured data) is replaced with the same base.
 */
function seo(siteUrl: string | undefined, contactApiUrl: string | undefined): Plugin {
  const base = siteUrl?.trim().replace(/\/+$/, '');
  const apiOrigin = originOf(contactApiUrl?.trim());

  return {
    name: 'portfolio-seo',
    transformIndexHtml(html) {
      const tags: HtmlTagDescriptor[] = [];

      // Resolve DNS for a cross-origin contact API early, so the first submit is quicker.
      if (apiOrigin && apiOrigin !== originOf(base)) {
        tags.push({ tag: 'link', attrs: { rel: 'dns-prefetch', href: apiOrigin }, injectTo: 'head' });
      }

      if (base) {
        tags.push(
          { tag: 'link', attrs: { rel: 'canonical', href: `${base}/` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:url', content: `${base}/` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:image', content: `${base}/og-image.png` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:image:height', content: '630' }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:image:alt', content: OG_IMAGE_ALT }, injectTo: 'head' },
          { tag: 'meta', attrs: { name: 'twitter:image', content: `${base}/og-image.png` }, injectTo: 'head' },
          { tag: 'meta', attrs: { name: 'twitter:image:alt', content: OG_IMAGE_ALT }, injectTo: 'head' },
        );
      }

      return { html: html.replaceAll('__SITE_URL__', base ?? ''), tags };
    },
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /', ...(base ? [`Sitemap: ${base}/sitemap.xml`] : [])];
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots.join('\n')}\n` });

      if (base) {
        const lastmod = new Date().toISOString().slice(0, 10);
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            `  <url><loc>${base}/</loc><lastmod>${lastmod}</lastmod><priority>1.0</priority></url>`,
            '</urlset>',
            '',
          ].join('\n'),
        });
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), seo(env.SITE_URL, env.VITE_CONTACT_API_URL)],
    server: {
      // With no VITE_CONTACT_API_URL the form posts to /api on the same origin;
      // in dev that is forwarded to the contact API in server/.
      proxy: { '/api': 'http://localhost:4000' },
    },
    test: {
      include: ['src/**/*.test.{ts,tsx}'],
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: { modules: { classNameStrategy: 'non-scoped' } },
    },
  };
});
