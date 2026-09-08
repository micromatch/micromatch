'use strict';

const assert = require('assert');
const mm = require('..');

describe('.matchKeys()', () => {
  describe('error handling', () => {
    it('should throw when the first argument is not an object', () => {
      assert.throws(() => mm.matchKeys(), /Expected the first argument to be an object/);
      assert.throws(() => mm.matchKeys('foo'), /Expected the first argument to be an object/);
      assert.throws(() => mm.matchKeys(['foo']), /Expected the first argument to be an object/);
    });
  });

  describe('match object keys', () => {
    it('should preserve an own __proto__ key without changing the result prototype', () => {
      const obj = JSON.parse('{"__proto__":{"hidden":true},"ordinary":1}');
      const result = mm.matchKeys(obj, '*');
      assert.deepStrictEqual(Object.keys(result), ['__proto__', 'ordinary']);
      assert.strictEqual(Object.getPrototypeOf(result), Object.prototype);
      assert.strictEqual(result.__proto__, obj.__proto__);
      assert.deepStrictEqual(Object.getOwnPropertyDescriptor(result, '__proto__'), {
        value: obj.__proto__, enumerable: true, configurable: true, writable: true
      });
      assert.deepStrictEqual(mm.matchKeys(obj, 'ordinary'), { ordinary: 1 });
    });

    it('should return a new object with only keys that match the given glob pattern', () => {
      assert.deepEqual(mm.matchKeys({ a: 'a', b: 'b', c: 'c' }, '*'), { a: 'a', b: 'b', c: 'c' });
      assert.deepEqual(mm.matchKeys({ a: 'a', b: 'b', c: 'c' }, 'a'), { a: 'a' });
      assert.deepEqual(mm.matchKeys({ a: 'a', b: 'b', c: 'c' }, '[a-b]'), { a: 'a', b: 'b' });
      assert.deepEqual(mm.matchKeys({ a: 'a', b: 'b', c: 'c' }, '(a|c)'), { a: 'a', c: 'c' });
      assert.notDeepEqual(mm.matchKeys({ a: 'a', b: 'b', c: 'c' }, 'a'), { b: 'b' });
    });
  });
});
