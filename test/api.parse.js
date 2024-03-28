'use strict';

const assert = require('assert');
const mm = require('..');

describe('.parse()', () => {
  it('should parse a glob', () => {
    if (process.platform === 'win32') return this.skip();

    const results = mm.parse('a/*');
    const { tokens } = results[0];

    tokens.forEach(token => {
      delete token.prev;
    });

    assert.deepEqual(tokens, [
      { type: 'bos', value: '', output: '' },
      { type: 'text', value: 'a' },
      { type: 'slash', value: '/', output: '\\/(?!\\.)(?=.)' },
      { type: 'star', value: '*', output: '[^/]*?' },
      { type: 'maybe_slash', value: '', output: '\\/?' }
    ]);
  });
});
