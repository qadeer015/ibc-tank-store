const test = require('node:test');
const assert = require('node:assert/strict');
const { escapeLike, highlightText, optionalNumber } = require('../utils/search');

test('escapes LIKE wildcards', () => {
    assert.equal(escapeLike('100%_tank'), '100\\%\\_tank');
});

test('highlights a match without allowing markup from the product name', () => {
    const html = highlightText('<b>IBC</b> tank', 'ibc');
    assert.equal(html.includes('<b>'), false);
    assert.match(html, /<mark>IBC<\/mark>/);
});

test('optionalNumber ignores blank and invalid values', () => {
    assert.equal(optionalNumber(''), null);
    assert.equal(optionalNumber('nope'), null);
    assert.equal(optionalNumber('2500'), 2500);
    assert.equal(optionalNumber(0), 0);
});
