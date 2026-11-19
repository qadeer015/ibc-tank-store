const test = require('node:test');
const assert = require('node:assert/strict');
const { readCatalogFilters, catalogQuery, filterChips } = require('../utils/catalogFilters');

test('reads catalog filters and drops invalid values', () => {
    const filters = readCatalogFilters({
        category: '4',
        minPrice: '1000',
        maxPrice: 'bad',
        condition: 'Used',
        inStock: '1',
        sort: 'price_asc',
    });
    assert.equal(filters.categoryId, 4);
    assert.equal(filters.minPrice, 1000);
    assert.equal(filters.maxPrice, null);
    assert.equal(filters.condition, 'used');
    assert.equal(filters.inStock, true);
    assert.equal(filters.sort, 'price_asc');
});

test('builds a parameterized query and never interpolates the sort from raw input', () => {
    const filters = readCatalogFilters({ sort: 'price; drop table products', inStock: 'on', category: '2' });
    const { sql, params } = catalogQuery(filters);
    assert.match(sql, /p\.category_id = \?/);
    assert.match(sql, /p\.stock > 0/);
    assert.match(sql, /ORDER BY p\.created_at DESC/);
    assert.equal(sql.includes('drop table'), false);
    assert.deepEqual(params, [2]);
});

test('chip links remove only the selected filter', () => {
    const filters = readCatalogFilters({ category: '3', condition: 'new', sort: 'name' });
    const chips = filterChips(filters, 'Water tanks');
    const categoryChip = chips.find((chip) => chip.label === 'Water tanks');
    assert.match(categoryChip.href, /condition=new/);
    assert.equal(categoryChip.href.includes('category='), false);
});
