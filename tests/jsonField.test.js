const test = require('node:test');
const assert = require('node:assert/strict');
const { parseJsonField } = require('../utils/jsonField');

test('returns an object unchanged', () => {
    const value = { Capacity: '1000 L' };
    assert.deepEqual(parseJsonField(value), value);
});

test('parses a JSON string', () => {
    assert.deepEqual(parseJsonField('{"Material":"HDPE"}'), { Material: 'HDPE' });
});

test('parses a double-encoded JSON string', () => {
    assert.deepEqual(parseJsonField('"{\\"Valve\\":\\"2 inch\\"}"'), { Valve: '2 inch' });
});

test('treats empty and invalid values as an empty object', () => {
    assert.deepEqual(parseJsonField(null), {});
    assert.deepEqual(parseJsonField(''), {});
    assert.deepEqual(parseJsonField('null'), {});
    assert.deepEqual(parseJsonField('not json'), {});
    assert.deepEqual(parseJsonField('["a"]'), {});
});
