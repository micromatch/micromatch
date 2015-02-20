/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
require('should');
var argv = require('minimist')(process.argv.slice(2));
var ref = require('./support/reference');
var mm = require('..');

if ('minimatch' in argv) {
  mm = ref.minimatch;
}

describe('special characters', function () {
  describe('?:', function () {
    it('should match one character per question mark:', function () {
      mm.match(['a/b/c.md'], 'a/?/c.md').should.eql(['a/b/c.md']);
      mm.match(['a/bb/c.md'], 'a/?/c.md').should.eql([]);
      mm.match(['a/bb/c.md'], 'a/??/c.md').should.eql(['a/bb/c.md']);
      mm.match(['a/bbb/c.md'], 'a/??/c.md').should.eql([]);
      mm.match(['a/bbb/c.md'], 'a/???/c.md').should.eql(['a/bbb/c.md']);
      mm.match(['a/bbbb/c.md'], 'a/????/c.md').should.eql(['a/bbbb/c.md']);
    });

    it('should match multiple groups of question marks:', function () {
      mm.match(['a/bb/c/dd/e.md'], 'a/?/c/?/e.md').should.eql([]);
      mm.match(['a/b/c/d/e.md'], 'a/?/c/?/e.md').should.eql(['a/b/c/d/e.md']);
      mm.match(['a/b/c/d/e.md'], 'a/?/c/???/e.md').should.eql([]);
      mm.match(['a/b/c/zzz/e.md'], 'a/?/c/???/e.md').should.eql(['a/b/c/zzz/e.md']);
    });


    it('should use special characters and glob stars together:', function () {
      mm.match(['a/b/c/d/e.md'], 'a/?/c/?/*/e.md').should.eql([]);
      mm.match(['a/b/c/d/e/e.md'], 'a/?/c/?/*/e.md').should.eql(['a/b/c/d/e/e.md']);
      mm.match(['a/b/c/d/efghijk/e.md'], 'a/?/c/?/*/e.md').should.eql(['a/b/c/d/efghijk/e.md']);
      mm.match(['a/b/c/d/efghijk/e.md'], 'a/?/**/e.md').should.eql(['a/b/c/d/efghijk/e.md']);
      mm.match(['a/bb/c/d/efghijk/e.md'], 'a/?/**/e.md').should.eql([]);
      mm.match(['a/b/c/d/efghijk/e.md'], 'a/*/?/**/e.md').should.eql(['a/b/c/d/efghijk/e.md']);
      mm.match(['a/b/c/d/efgh.ijk/e.md'], 'a/*/?/**/e.md').should.eql(['a/b/c/d/efgh.ijk/e.md']);
      mm.match(['a/b.bb/c/d/efgh.ijk/e.md'], 'a/*/?/**/e.md').should.eql(['a/b.bb/c/d/efgh.ijk/e.md']);
      mm.match(['a/bbb/c/d/efgh.ijk/e.md'], 'a/*/?/**/e.md').should.eql(['a/bbb/c/d/efgh.ijk/e.md']);
    });
  });

  describe('[ab] - brackets:', function () {
    it('should support regex character classes:', function () {
      mm.match(['a/b.md', 'a/c.md', 'a/d.md', 'a/E.md'], 'a/[A-Z].md').should.eql(['a/E.md']);
      mm.match(['a/b.md', 'a/c.md', 'a/d.md'], 'a/[bd].md').should.eql(['a/b.md', 'a/d.md']);
      mm.match(['a-1.md', 'a-2.md', 'a-3.md', 'a-4.md', 'a-5.md'], 'a-[2-4].md').should.eql(['a-2.md', 'a-3.md', 'a-4.md']);
      mm.match(['a/b.md', 'b/b.md', 'c/b.md', 'b/c.md', 'a/d.md'], '[bc]/[bd].md').should.eql(['b/b.md', 'c/b.md']);
    });
  });

  describe('(a|b) - logical OR:', function () {
    it('should support regex logical OR:', function () {
      mm.match(['a/a', 'a/b', 'a/c', 'b/a', 'b/b'], '(a|b)/b').should.eql(['a/b', 'b/b']);
      mm.match(['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'c/b'], '((a|b)|c)/b').should.eql(['a/b', 'b/b', 'c/b']);
      mm.match(['a/b.md', 'a/c.md', 'a/d.md'], 'a/(b|d).md').should.eql(['a/b.md', 'a/d.md']);
      mm.match(['a-1.md', 'a-2.md', 'a-3.md', 'a-4.md', 'a-5.md'], 'a-(2|3|4).md').should.eql(['a-2.md', 'a-3.md', 'a-4.md']);
      mm.match(['a/b.md', 'b/b.md', 'c/b.md', 'b/c.md', 'a/d.md'], '(b|c)/(b|d).md').should.eql(['b/b.md', 'c/b.md']);
      mm.match(['a/b.md', 'b/b.md', 'c/b.md', 'b/c.md', 'a/d.md'], '{b,c}/{b,d}.md').should.eql(['b/b.md', 'c/b.md']);
    });
  });
});
