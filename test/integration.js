'use strict';

var assert = require('assert');
var mm = require('..');

describe('globstars', function() {
  it('with char classes', function() {
    var fixtures = ['a.b', 'a,b', 'a:b', 'a-b', 'a;b', 'a b', 'a_b'];
    assert.deepEqual(mm.match(fixtures, 'a[^[:alnum:]]b'), fixtures);
    assert.deepEqual(mm.match(fixtures, 'a@([^[:alnum:]])b'), fixtures);
    assert.deepEqual(mm.match(fixtures, 'a@([-.,:; _])b'), fixtures);

    assert.deepEqual(mm.match(fixtures, 'a@([^x])b'), ['a,b', 'a:b', 'a-b', 'a;b', 'a b', 'a_b']);
    assert.deepEqual(mm.match(fixtures, 'a+([^[:alnum:]])b'), fixtures);
  });
});
