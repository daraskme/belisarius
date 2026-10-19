import fs from 'node:fs/promises';
import path from 'node:path';

export const siteOrigin = 'https://belisarius.darask.me';

export async function configureDomain(dist) {
  const urls = [];
  async function visit(directory) {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(file);
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        const relative = path.relative(dist, file).split(path.sep).join('/');
        const route = relative === 'index.html' ? '' : relative.replace(/index\.html$/, '');
        const canonical = new URL(route, siteOrigin + '/').href;
        let html = await fs.readFile(file, 'utf8');
        if (!/<\/head>/i.test(html)) throw new Error('headがありません: ' + relative);
        html = html.replace(/<link\b[^>]*\brel=["']canonical["'][^>]*>/gi, '')
          .replace(/<meta\b[^>]*\bproperty=["']og:url["'][^>]*>/gi, '');
        html = html.replace(/<\/head>/i, `<link rel="canonical" href="${canonical}"><meta property="og:url" content="${canonical}"></head>`);
        await fs.writeFile(file, html);
        urls.push(canonical);
      }
    }
  }
  await visit(dist);
  urls.sort();
  await fs.writeFile(path.join(dist, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map(url => `  <url><loc>${url}</loc></url>`).join('\n') + '\n</urlset>\n');
  await fs.writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`);
}
