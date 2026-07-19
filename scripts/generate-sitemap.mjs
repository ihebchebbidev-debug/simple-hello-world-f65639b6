// Runs before `vite dev` and `vite build`; writes public/sitemap.xml.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_URL = '';
const __dirname = dirname(fileURLToPath(import.meta.url));

const staticEntries = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/a-propos', changefreq: 'monthly', priority: '0.7' },
  { path: '/produits', changefreq: 'weekly', priority: '0.9' },
  { path: '/actualites', changefreq: 'weekly', priority: '0.6' },
  { path: '/contact', changefreq: 'monthly', priority: '0.5' },
];

function loadProductSlugs() {
  const src = readFileSync(resolve(__dirname, '../src/data/products.ts'), 'utf8');
  return Array.from(src.matchAll(/slug:\s*'([^']+)'/g)).map((match) => match[1]);
}

function xml(entries) {
  const urls = entries.map((entry) => [
    '  <url>',
    `    <loc>${BASE_URL}${entry.path}</loc>`,
    entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : null,
    entry.priority ? `    <priority>${entry.priority}</priority>` : null,
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

const slugs = loadProductSlugs();
const entries = [
  ...staticEntries,
  ...slugs.map((slug) => ({ path: `/produits/${slug}`, changefreq: 'monthly', priority: '0.8' })),
];

writeFileSync(resolve(__dirname, '../public/sitemap.xml'), xml(entries));
console.log(`sitemap.xml written (${entries.length} entries)`);
