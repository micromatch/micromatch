/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('should');
var mm = require('..');

describe('.matchKeys()', function () {
  describe('errors:', function () {
    it('should throw on undefined args:', function () {
      (function () {
        mm.matchKeys();
      }).should.throw('micromatch.matchKeys(): first argument should be an object.');
    });

    it('should throw on bad args:', function () {
      (function () {
        mm.matchKeys('foo');
      }).should.throw('micromatch.matchKeys(): first argument should be an object.');
    });
  });

  describe('match object keys:', function () {
    it('should return a new object with only keys that match a glob pattern:', function () {
      mm.matchKeys({a: 'a', b: 'b', c: 'c'}, '*').should.eql({a: 'a', b: 'b', c: 'c'});
      mm.matchKeys({a: 'a', b: 'b', c: 'c'}, 'a').should.eql({a: 'a'});
      mm.matchKeys({a: 'a', b: 'b', c: 'c'}, 'a').should.not.eql({b: 'b'});
      mm.matchKeys({a: 'a', b: 'b', c: 'c'}, '[a-b]').should.eql({a: 'a', b: 'b'});
      mm.matchKeys({a: 'a', b: 'b', c: 'c'}, '(a|c)').should.eql({a: 'a', c: 'c'});
    });

    it('should return a new object with only keys that match a regex:', function () {
      mm.matchKeys({a: 'a', b: 'b', c: 'c'}, /.*/).should.eql({a: 'a', b: 'b', c: 'c'});
      mm.matchKeys({a: 'a', b: 'b', c: 'c'}, /a/).should.eql({a: 'a'});
      mm.matchKeys({a: 'a', b: 'b', c: 'c'}, /a/).should.not.eql({b: 'b'});
      mm.matchKeys({a: 'a', b: 'b', c: 'c'}, /[a-b]/).should.eql({a: 'a', b: 'b'});
      mm.matchKeys({a: 'a', b: 'b', c: 'c'}, /(a|c)/).should.eql({a: 'a', c: 'c'});
    });
  });
});
