const test = require('node:test');
const assert = require('node:assert/strict');
const { cartKey, addQuantity, setQuantity } = require('../utils/cartRules');

test('keeps a signed-in cart separate from a guest cart', () => {
    assert.equal(cartKey({ id: 9 }, 'abc').key, 'user:9');
    assert.equal(cartKey(null, 'abc').key, 'guest:abc');
});

test('refuses to add more than the stock on hand', () => {
    assert.equal(addQuantity(2, 2, 3).ok, false);
    assert.equal(addQuantity(1, 1, 3).quantity, 2);
});

test('removes an item when the new quantity is zero and blocks a negative request that is not an integer', () => {
    assert.equal(setQuantity(0, 5).remove, true);
    assert.equal(setQuantity(-1, 5).remove, true);
    assert.equal(setQuantity(1.5, 5).ok, false);
    assert.equal(setQuantity(4, 3).ok, false);
    assert.equal(setQuantity(2, 3).quantity, 2);
});
