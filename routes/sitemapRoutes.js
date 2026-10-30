// routes/sitemapRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const {
  SITE_URL,
  STATIC_PAGES,
  formatSitemapDate,
  escapeXml,
} = require('../utils/seo');

router.get('/sitemap.xml', async (req, res) => {
  try {
    const today = formatSitemapDate(new Date());
    const products = await Product.getSitemapEntries();

    const urls = [
      ...STATIC_PAGES.map((page) => ({
        loc: `${SITE_URL}${page.path === '/' ? '/' : page.path}`,
        lastmod: today,
        changefreq: page.changefreq,
        priority: page.priority,
      })),
      ...products.map((product) => ({
        loc: `${SITE_URL}/products/${product.id}`,
        lastmod: formatSitemapDate(product.created_at),
        changefreq: 'weekly',
        priority: '0.8',
      })),
    ];

    const body = urls
      .map(
        (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${escapeXml(url.lastmod)}</lastmod>
    <changefreq>${escapeXml(url.changefreq)}</changefreq>
    <priority>${escapeXml(url.priority)}</priority>
  </url>`
      )
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;

    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.header('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).type('text/plain').send('Sitemap temporarily unavailable');
  }
});

module.exports = router;
