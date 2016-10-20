'use strict';

var assert = require('assert');
var mm = require('./support/match');

describe('globstars', function() {
  it('with char classes', function() {
    var fixtures = ['a.b', 'a,b', 'a:b', 'a-b', 'a;b', 'a b', 'a_b'];
    mm(fixtures, 'a[^[:alnum:]]b', fixtures);
    mm(fixtures, 'a@([^[:alnum:]])b', fixtures);
    mm(fixtures, 'a@([-.,:; _])b', fixtures);

    mm(fixtures, 'a@([^x])b', ['a,b', 'a:b', 'a-b', 'a;b', 'a b', 'a_b']);
    mm(fixtures, 'a+([^[:alnum:]])b', fixtures);
  });
});
