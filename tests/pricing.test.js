const test = require('node:test');
const assert = require('node:assert/strict');
const { validateSaleAndMargin, pricingFrom } = require('../utils/pricing');

test('accepts a sale below the list price and a margin inside 0-100', () => {
    const result = validateSaleAndMargin({ price: 10000, salePrice: '8500', marginPercent: '20' });
    assert.deepEqual(result.errors, []);
    assert.equal(result.salePrice, 8500);
    assert.equal(result.marginPercent, 20);
});

test('rejects a sale that is not a discount and a margin outside the range', () => {
    const result = validateSaleAndMargin({ price: 10000, salePrice: 10000, marginPercent: 120 });
    assert.equal(result.errors.length, 2);
});

test('treats blank sale and margin as unset', () => {
    const result = validateSaleAndMargin({ price: 5000, salePrice: '  ', marginPercent: '' });
    assert.deepEqual(result.errors, []);
    assert.equal(result.salePrice, null);
    assert.equal(result.marginPercent, null);
});

test('computes the public price, discount, and estimated cost', () => {
    const pricing = pricingFrom({ price: 10000, sale_price: 8000, margin_percent: 25 });
    assert.equal(pricing.onSale, true);
    assert.equal(pricing.current, 8000);
    assert.equal(pricing.discountPercent, 20);
    assert.equal(pricing.estimatedCost, 6000);
});

test('ignores a sale price that is not lower than the list price', () => {
    const pricing = pricingFrom({ price: 10000, sale_price: 12000, margin_percent: null });
    assert.equal(pricing.onSale, false);
    assert.equal(pricing.current, 10000);
});
