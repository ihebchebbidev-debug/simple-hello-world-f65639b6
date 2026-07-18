// Runs before `vite dev` and `vite build`; writes public/sitemap.xml.
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// TODO: replace with your project URL once a project name or custom domain is set.
const BASE_URL = '';

const __dirname = dirname(fileURLToPath(import.meta.url));

type Entry = { path: string; changefreq?: string; priority?: string };

// Static routes (mirror src/App.tsx).
const staticEntries: Entry[] = [
  { path: '/',           changefreq: 'weekly',  priority: '1.0' },
  { path: '/a-propos',   changefreq: 'monthly', priority: '0.7' },
  { path: '/produits',   changefreq: 'weekly',  priority: '0.9' },
  { path: '/actualites', changefreq: 'weekly',  priority: '0.6' },
  { path: '/contact',    changefreq: 'monthly', priority: '0.5' },
];

// Dynamic product routes — read slugs from data source without triggering asset imports.
async function loadProductSlugs(): Promise<string[]> {
  const src = await import('node:fs').then((m) =>
    m.readFileSync(resolve(__dirname, '../src/data/products.ts'), 'utf8'),
  );
  return Array.from(src.matchAll(/slug:\s*'([^']+)'/g)).map((m) => m[1]);
}

function xml(entries: Entry[]) {
  const urls = entries.map((e) => [
    '  <url>',
    `    <loc>${BASE_URL}${e.path}</loc>`,
    e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
    e.priority ? `    <priority>${e.priority}</priority>` : null,
    '  </url>',
  ].filter(Boolean).join('\n'));
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}

const slugs = await loadProductSlugs();
const entries: Entry[] = [
  ...staticEntries,
  ...slugs.map<Entry>((slug) => ({ path: `/produits/${slug}`, changefreq: 'monthly', priority: '0.8' })),
];

writeFileSync(resolve(__dirname, '../public/sitemap.xml'), xml(entries));
console.log(`sitemap.xml written (${entries.length} entries)`);
