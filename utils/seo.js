// utils/seo.js
const SITE_URL = (process.env.SITE_URL || 'https://ibctankstore.com').replace(/\/$/, '');

const DEFAULT_DESCRIPTION =
  "IBC Tank Store — Pakistan's trusted marketplace for new & used IBC tanks. Buy water tanks, chemical containers & storage solutions at the best prices.";

const DEFAULT_KEYWORDS =
  'IBC tanks Pakistan, IBC tank store, buy IBC tanks, used IBC tanks, water tanks Lahore, chemical containers, Sumandri Jhag, storage tanks';

function stripHtml(html) {
  return String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(text, max = 160) {
  const clean = stripHtml(text);
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}

function absoluteUrl(path = '/') {
  if (!path) return SITE_URL + '/';
  if (/^https?:\/\//i.test(path)) return path;
  return SITE_URL + (path.startsWith('/') ? path : `/${path}`);
}

function formatSitemapDate(date) {
  if (!date) return new Date().toISOString().slice(0, 10);
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildProductSchema(product, { siteUrl, currency = 'PKR', images = [] } = {}) {
  const imageList = (images && images.length ? images : (product.image ? [product.image] : []))
    .map((img) => absoluteUrl(img));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: truncate(product.description || product.name, 300),
    sku: String(product.id),
    category: product.category_name || undefined,
    image: imageList.length ? imageList : undefined,
    brand: {
      '@type': 'Brand',
      name: 'IBC Tank Store',
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/products/${product.id}`,
      priceCurrency: currency || 'PKR',
      price: String(product.price),
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: /used/i.test(product.product_condition || '')
        ? 'https://schema.org/UsedCondition'
        : 'https://schema.org/NewCondition',
    },
  };

  const ratingValue = parseFloat(product.rating);
  const ratingCount = parseInt(product.rating_count, 10);
  if (ratingValue > 0 && ratingCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: String(ratingValue),
      reviewCount: String(ratingCount),
      bestRating: '5',
      worstRating: '1',
    };
  }

  return schema;
}

const STATIC_PAGES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/products', changefreq: 'daily', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/faqs', changefreq: 'monthly', priority: '0.7' },
  { path: '/order-tracking', changefreq: 'monthly', priority: '0.6' },
  { path: '/payment-methods', changefreq: 'monthly', priority: '0.5' },
  { path: '/shipping-and-delivery', changefreq: 'monthly', priority: '0.5' },
  { path: '/returns-and-refunds', changefreq: 'yearly', priority: '0.4' },
  { path: '/order-cancellation-policy', changefreq: 'yearly', priority: '0.4' },
  { path: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
];

module.exports = {
  SITE_URL,
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  STATIC_PAGES,
  stripHtml,
  truncate,
  absoluteUrl,
  formatSitemapDate,
  escapeXml,
  escapeHtml,
  buildProductSchema,
};
