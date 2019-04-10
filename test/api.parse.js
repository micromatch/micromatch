'use strict';

const assert = require('assert');
const mm = require('..');

describe('.parse()', () => {
  it('should parse a glob', () => {
    let results = mm.parse('a/*');
    let { tokens } = results[0];

    tokens.forEach(token => {
      delete token.prev;
    });

    const star = process.platform === 'win32' ? '[^\\\\\\/]*?' : '[^/]*?';

    assert.deepEqual(tokens, [
      { type: 'bos', value: '', output: '' },
      { type: 'text', value: 'a' },
      { type: 'slash', value: '/', output: '\\/(?!\\.)(?=.)' },
      { type: 'star', value: '*', output: star },
      { type: 'maybe_slash', value: '', output: '\\/?' }
    ]);
  });
});
