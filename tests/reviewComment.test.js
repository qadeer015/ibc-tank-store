const test = require('node:test');
const assert = require('node:assert/strict');
const { cleanComment } = require('../utils/reviewComment');

test('accepts a short comment and strips markup', () => {
    const result = cleanComment({ authorName: 'Ayesha', email: '', body: '  <b>Fits our yard.</b>  ' });
    assert.deepEqual(result.errors, []);
    assert.equal(result.body, 'Fits our yard.');
    assert.equal(result.email, null);
});

test('rejects a missing name and an invalid email', () => {
    const result = cleanComment({ authorName: 'A', email: 'not-an-email', body: 'Hi' });
    assert.equal(result.errors.length, 2);
});
