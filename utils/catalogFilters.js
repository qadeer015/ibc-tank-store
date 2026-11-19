const SORTS = {
    newest: 'p.created_at DESC',
    price_asc: 'p.price ASC, p.id DESC',
    price_desc: 'p.price DESC, p.id DESC',
    name: 'p.name ASC',
};

const CONDITIONS = ['new', 'used', 'refurbished'];

function readCatalogFilters(query = {}) {
    const categoryId = parseInt(query.category, 10);
    const minPrice = query.minPrice === undefined || query.minPrice === '' ? null : Number(query.minPrice);
    const maxPrice = query.maxPrice === undefined || query.maxPrice === '' ? null : Number(query.maxPrice);
    const condition = CONDITIONS.includes(String(query.condition || '').toLowerCase())
        ? String(query.condition).toLowerCase()
        : '';
    const sort = Object.prototype.hasOwnProperty.call(SORTS, query.sort) ? query.sort : 'newest';

    return {
        categoryId: Number.isInteger(categoryId) && categoryId > 0 ? categoryId : null,
        minPrice: Number.isFinite(minPrice) ? minPrice : null,
        maxPrice: Number.isFinite(maxPrice) ? maxPrice : null,
        condition,
        inStock: query.inStock === '1' || query.inStock === 'on',
        sort,
    };
}

function catalogQuery(filters) {
    let sql = `SELECT p.*, c.name AS category_name
               FROM products p
               JOIN categories c ON p.category_id = c.id
               WHERE 1=1`;
    const params = [];

    if (filters.categoryId) {
        sql += ' AND p.category_id = ?';
        params.push(filters.categoryId);
    }
    if (filters.minPrice != null) {
        sql += ' AND p.price >= ?';
        params.push(filters.minPrice);
    }
    if (filters.maxPrice != null) {
        sql += ' AND p.price <= ?';
        params.push(filters.maxPrice);
    }
    if (filters.condition) {
        sql += ' AND LOWER(p.product_condition) = ?';
        params.push(filters.condition);
    }
    if (filters.inStock) {
        sql += ' AND p.stock > 0';
    }

    sql += ` ORDER BY ${SORTS[filters.sort] || SORTS.newest}`;
    return { sql, params };
}

function catalogHref(filters) {
    const params = new URLSearchParams();
    if (filters.categoryId) params.set('category', String(filters.categoryId));
    if (filters.minPrice != null) params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice != null) params.set('maxPrice', String(filters.maxPrice));
    if (filters.condition) params.set('condition', filters.condition);
    if (filters.inStock) params.set('inStock', '1');
    if (filters.sort && filters.sort !== 'newest') params.set('sort', filters.sort);
    const query = params.toString();
    return query ? `/products?${query}` : '/products';
}

function filterChips(filters, categoryName) {
    const chips = [];
    if (filters.categoryId) {
        chips.push({
            label: categoryName || 'Category',
            href: catalogHref({ ...filters, categoryId: null }),
        });
    }
    if (filters.minPrice != null) {
        chips.push({
            label: `Min ${filters.minPrice}`,
            href: catalogHref({ ...filters, minPrice: null }),
        });
    }
    if (filters.maxPrice != null) {
        chips.push({
            label: `Max ${filters.maxPrice}`,
            href: catalogHref({ ...filters, maxPrice: null }),
        });
    }
    if (filters.condition) {
        chips.push({
            label: filters.condition[0].toUpperCase() + filters.condition.slice(1),
            href: catalogHref({ ...filters, condition: '' }),
        });
    }
    if (filters.inStock) {
        chips.push({
            label: 'In stock',
            href: catalogHref({ ...filters, inStock: false }),
        });
    }
    if (filters.sort && filters.sort !== 'newest') {
        const labels = { price_asc: 'Price: low to high', price_desc: 'Price: high to low', name: 'Name' };
        chips.push({
            label: labels[filters.sort] || filters.sort,
            href: catalogHref({ ...filters, sort: 'newest' }),
        });
    }
    return chips;
}

module.exports = { readCatalogFilters, catalogQuery, catalogHref, filterChips };
