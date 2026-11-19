const test = require('node:test');
const assert = require('node:assert/strict');
const calculateTotals = require('../utils/calculateTotals');
const { phonesMatch, readOrderInput } = require('../utils/orderInput');

test('charges delivery under the free-delivery threshold', () => {
    const totals = calculateTotals([{ price: 10000, quantity: 2 }]);
    assert.equal(totals.subtotal, 20000);
    assert.equal(totals.deliveryCharges, 1500);
    assert.equal(totals.total, 21500);
});

test('waives delivery at 50000', () => {
    const totals = calculateTotals([{ price: 50000, quantity: 1 }]);
    assert.equal(totals.deliveryCharges, 0);
});

test('matches the last 10 phone digits and rejects a short number', () => {
    assert.equal(phonesMatch('+92 300 1234567', '03001234567'), true);
    assert.equal(phonesMatch('03001234567', '03009999999'), false);
    assert.equal(phonesMatch('03001234567', '123'), false);
});

test('requires a name, phone, address, city, and payment method', () => {
    const missing = readOrderInput({});
    assert.ok(missing.errors.length >= 4);
    const ok = readOrderInput({
        fullName: 'Ayesha Khan',
        phone: '03001234567',
        addressLine1: '12 Industrial Estate',
        city: 'Lahore',
        paymentMethod: 'cod',
    });
    assert.deepEqual(ok.errors, []);
});
