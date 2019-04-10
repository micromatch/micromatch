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
    it('should return a new object with only keys that match the given glob pattern', () => {
      assert.deepEqual(mm.matchKeys({ a: 'a', b: 'b', c: 'c' }, '*'), { a: 'a', b: 'b', c: 'c' });
      assert.deepEqual(mm.matchKeys({ a: 'a', b: 'b', c: 'c' }, 'a'), { a: 'a' });
      assert.deepEqual(mm.matchKeys({ a: 'a', b: 'b', c: 'c' }, '[a-b]'), { a: 'a', b: 'b' });
      assert.deepEqual(mm.matchKeys({ a: 'a', b: 'b', c: 'c' }, '(a|c)'), { a: 'a', c: 'c' });
      assert.notDeepEqual(mm.matchKeys({ a: 'a', b: 'b', c: 'c' }, 'a'), { b: 'b' });
    });
  });
});
