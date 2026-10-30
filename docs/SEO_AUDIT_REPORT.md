# SEO Audit Report — ibctankstore.com  
**Date:** June 8, 2026  
**Auditor:** Automated Codebase & Live-Site Analysis

---

## ⚠️ CRITICAL: Root URL Returns HTTP 404

**Severity:** 🔴 CRITICAL — Site Down for Search Engines  

**Finding:** `https://ibctankstore.com/` returns HTTP 404 (Vercel error).  
```
HTTP/2 404
x-vercel-error: NOT_FOUND
```

**Root Cause (hypothesized):** The Express app is deployed on Vercel. The `server.js` home route (`app.get('/', ...)`) likely crashes due to a database connection failure, hitting the 404 catch-all at line 212. The app tries to fetch `Product.getTopRated()`, `Category.getAll()`, `Product.getLatest()`, and `Setting.all()` on the homepage — if the DB connection pool fails, the entire page throws and falls through to 404.

**Action Required:**
1. Check MySQL/TiDB connection credentials in production `.env`
2. Verify the database is running and the `products`, `categories`, `settings` tables exist
3. Add robust error handling in the home route so it renders a basic page even if DB fails
4. Deploy a fix immediately — Google cannot index a 404

---

## 🔴 HIGH: Missing Meta Tags for Social & SEO

### 1. Generic Meta Description
**Severity:** 🔴 HIGH  
**File:** `views/layouts/public.ejs` line 9  
```html
<meta name="description" content="IBC Tank Store's Public Site">
```
**Fix:** Replace with a keyword-rich 150–160 char description:
```html
<meta name="description" content="IBC Tank Store — Pakistan's trusted marketplace for new & used IBC tanks. Buy water tanks, chemical containers & storage solutions at the best prices. Shop now!">
```

### 2. No Open Graph Tags
**Severity:** 🔴 HIGH — these control how links appear on Facebook, WhatsApp, LinkedIn, etc.  
**File:** `views/layouts/public.ejs`  
**Fix:** Add after line 11:
```html
<meta property="og:title" content="<%= typeof title !=='undefined' ? title : 'IBC Tank Store' %> | IBC Tank Store">
<meta property="og:description" content="Pakistan's trusted marketplace for new & used IBC tanks and storage solutions.">
<meta property="og:image" content="https://ibctankstore.com/img/logo.png">
<meta property="og:url" content="https://ibctankstore.com/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="IBC Tank Store">
```

### 3. No Twitter Card Tags
**Severity:** 🟡 MEDIUM  
**Fix:** Add:
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="https://ibctankstore.com/img/logo.png">
```

---

## 🟡 MEDIUM: Technical SEO Gaps

### 4. No Canonical URL Tag
**Severity:** 🟡 MEDIUM — risk of duplicate content penalties  
**Fix:** Add to `<head>` in `public.ejs`:
```html
<link rel="canonical" href="https://ibctankstore.com<%= req.originalUrl %>">
```

### 5. No JSON-LD Structured Data
**Severity:** 🟡 MEDIUM — missed rich snippet opportunities  
**Recommended schemas:**
- **WebSite** schema (with searchAction) on all pages
- **Organization** schema with logo, contact, social profiles
- **Product** schema on product detail pages (in `show.ejs`)
- **BreadcrumbList** schema on all pages
- **FAQPage** schema on the FAQs page

### 6. `<html lang="en">` — Verify Language
**Severity:** 🟢 LOW  
The site is targeting a Pakistani audience but uses `lang="en"`. If the primary audience is Urdu/Pakistan, consider `lang="en-PK"` or multi-language support.

### 7. Duplicate Favicon Links
**Severity:** 🟢 LOW  
**File:** `views/layouts/public.ejs` lines 17–20 have 4 identical icon links. Remove duplicates:
```html
<link href="/img/favicon.ico" rel="icon">
<link href="/img/favicon.ico" rel="apple-touch-icon">
```

### 8. No Sitemap in robots.txt (FIXED ✓)
**Severity:** Previously 🔴 — **Fixed:** `public/robots.txt` and `public/sitemap.xml` created.

### 9. Missing HTTP Headers for SEO
**Severity:** 🟡 MEDIUM  
The site does not serve the following headers:
- `Link: <https://ibctankstore.com/sitemap.xml>; rel="sitemap"`
- `X-Robots-Tag: index, follow` (could be added for clarity)
- Missing Cache-Control headers for static assets could slow down SEO-related crawls

---

## 🟡 MEDIUM: On-Page Content Issues

### 10. Product Name Uses `<p>` Instead of `<h3>`
**Severity:** 🟡 MEDIUM — heading hierarchy matters for SEO  
**Files:** `views/public/home.ejs`, `views/public/search.ejs`, `views/public/products/index.ejs`  
Each product card wraps the product name in a `<p class="card-title">`. Change to `<h3 class="card-title h5">` for proper heading hierarchy (h1 → h2 site title → h3 product names).

### 11. Price Wrapped in `<strong>` Instead of Semantic Tag
**Severity:** 🟢 LOW  
Change `<strong class="card-text">` to `<span class="card-text price-text">` for cleaner semantics.

### 12. Thin Content on Policy Pages
**Severity:** 🟢 LOW  
Verify that `/privacy-policy`, `/terms`, `/shipping-and-delivery`, `/return-refund-policy` contain at least 300+ words of unique content. Short or placeholder content may be considered "thin."

### 13. No `alt` Text on Thumbnails
**Severity:** 🟡 MEDIUM  
**File:** `views/public/products/show.ejs` line 33  
```html
<img src="<%= image %>" class="product-thumb ..." data-index="<%= index %>" alt="Thumbnail" />
```
Change `alt="Thumbnail"` to `alt="<%= product.name %> - Image <%= index + 1 %>"`.

---

## 🟢 LOW: Performance & User Experience

### 14. CSS/JS Loaded from Multiple CDNs
- Bootstrap CSS (local), Bootstrap JS (CDN + local)
- Swiper CSS (CDN), Swiper JS (CDN)
- intl-tel-input (CDN)
- Google Analytics (CDN)
- Google AdSense (CDN)
- Fancybox (CDN)

Consolidate or self-host critical resources to reduce DNS lookups and improve load time.

### 15. Render-Blocking Resources
The Swiper CSS and Fancybox CSS are loaded in `<head>` without `media="print"` or `rel="preload"`. Consider using `rel="preload"` for critical above-the-fold styles.

### 16. No `<noscript>` Tag
Consider adding a `<noscript>` tag for users with JavaScript disabled:
```html
<noscript>Please enable JavaScript to view this website properly.</noscript>
```

---

## ✅ Already Working / Good

| Item | Status |
|------|--------|
| Viewport meta tag | ✅ Present |
| Bootstrap responsive layout | ✅ Present |
| Favicon | ✅ Present |
| Google Analytics (GA4) | ✅ Present (G-L32FERKX51) |
| Google AdSense | ✅ Present |
| Google Ads.txt | ✅ Present in `public/` |
| CSS & JS minification | ✅ Bootstrap CSS/JS are minified |
| `loading="lazy"` on images | ✅ Present on product cards |
| `target="_blank" rel="noopener noreferrer"` | ✅ Properly used on external links |

---

## 🚨 Priority Action Items (Ordered by Impact)

| # | Task | Severity | Effort |
|---|------|----------|--------|
| 1 | **Fix root URL 404** — Debug DB connection, add error fallback | 🔴 CRITICAL | 1–2 hrs |
| 2 | Add Open Graph meta tags to layout | 🔴 HIGH | 15 min |
| 3 | Enhance meta description with keywords | 🔴 HIGH | 5 min |
| 4 | Add JSON-LD structured data (Organization, WebSite, Product) | 🟡 MEDIUM | 1 hr |
| 5 | Add canonical URL tag to layout | 🟡 MEDIUM | 10 min |
| 6 | Change `<p>` product names to `<h3>` on home, search, product index | 🟡 MEDIUM | 15 min |
| 7 | Fix thumbnail alt text on product show page | 🟡 MEDIUM | 5 min |
| 8 | Add Twitter Card meta tags | 🟡 MEDIUM | 10 min |
| 9 | Fix duplicate favicon links | 🟢 LOW | 2 min |
| 10 | Clean up root-level sitemap.xml (keep only in `public/`) | 🟢 LOW | 1 min |

---

## 📊 Summary

| Category | Count |
|----------|-------|
| 🔴 Critical issues | **1** (Root URL 404) |
| 🔴 High severity | **2** (Meta description, missing OG/Twitter tags) |
| 🟡 Medium severity | **5** (Canonical, JSON-LD, heading hierarchy, alt text, HTTP headers) |
| 🟢 Low severity | **4** (Lang attribute, duplicate favicons, thin content check, perf) |

**Bottom line:** The root URL serving a 404 is a site-breaking SEO issue and must be fixed first. Once resolved, implementing Open Graph tags, JSON-LD structured data, and fixing the heading hierarchy will give the most noticeable SEO improvement.