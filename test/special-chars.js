/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var path = require('path');
var should = require('should');
var mm = require('..');

describe('special characters', function () {
  describe('?:', function () {
    it('should match one character per question mark:', function () {
      mm(['a/b/c.md'], 'a/?/c.md').should.eql(['a/b/c.md']);
      mm(['a/bb/c.md'], 'a/?/c.md').should.eql([]);
      mm(['a/bb/c.md'], 'a/??/c.md').should.eql(['a/bb/c.md']);
      mm(['a/bbb/c.md'], 'a/??/c.md').should.eql([]);
      mm(['a/bbb/c.md'], 'a/???/c.md').should.eql(['a/bbb/c.md']);
      mm(['a/bbbb/c.md'], 'a/????/c.md').should.eql(['a/bbbb/c.md']);
    });

    it('should match multiple groups of question marks:', function () {
      mm(['a/bb/c/dd/e.md'], 'a/?/c/?/e.md').should.eql([]);
      mm(['a/b/c/d/e.md'], 'a/?/c/?/e.md').should.eql(['a/b/c/d/e.md']);
      mm(['a/b/c/d/e.md'], 'a/?/c/???/e.md').should.eql([]);
      mm(['a/b/c/zzz/e.md'], 'a/?/c/???/e.md').should.eql(['a/b/c/zzz/e.md']);
    });

    it('should use special characters and glob stars together:', function () {
      mm(['a/b/c/d/e.md'], 'a/?/c/?/*/e.md').should.eql([]);
      mm(['a/b/c/d/e/e.md'], 'a/?/c/?/*/e.md').should.eql(['a/b/c/d/e/e.md']);
      mm(['a/b/c/d/efghijk/e.md'], 'a/?/c/?/*/e.md').should.eql(['a/b/c/d/efghijk/e.md']);
      mm(['a/b/c/d/efghijk/e.md'], 'a/?/**/e.md').should.eql(['a/b/c/d/efghijk/e.md']);
      mm(['a/bb/c/d/efghijk/e.md'], 'a/?/**/e.md').should.eql([]);
      mm(['a/b/c/d/efghijk/e.md'], 'a/*/?/**/e.md').should.eql(['a/b/c/d/efghijk/e.md']);
      mm(['a/b/c/d/efgh.ijk/e.md'], 'a/*/?/**/e.md').should.eql(['a/b/c/d/efgh.ijk/e.md']);
      mm(['a/b.bb/c/d/efgh.ijk/e.md'], 'a/*/?/**/e.md').should.eql(['a/b.bb/c/d/efgh.ijk/e.md']);
      mm(['a/bbb/c/d/efgh.ijk/e.md'], 'a/*/?/**/e.md').should.eql(['a/bbb/c/d/efgh.ijk/e.md']);
    });
  });

  describe('[ab] - brackets:', function () {
    it('should support regex character classes:', function () {
      mm(['a/b.md', 'a/c.md', 'a/d.md', 'a/E.md'], 'a/[A-Z].md').should.eql(['a/E.md']);
      mm(['a/b.md', 'a/c.md', 'a/d.md'], 'a/[bd].md').should.eql(['a/b.md', 'a/d.md']);
      mm(['a-1.md', 'a-2.md', 'a-3.md', 'a-4.md', 'a-5.md'], 'a-[2-4].md').should.eql(['a-2.md', 'a-3.md', 'a-4.md']);
      mm(['a/b.md', 'b/b.md', 'c/b.md', 'b/c.md', 'a/d.md'], '[bc]/[bd].md').should.eql(['b/b.md', 'c/b.md']);
    });
  });

  describe('(a|b) - logical OR:', function () {
    it('should support regex logical OR:', function () {
      mm(['a/a', 'a/b', 'a/c', 'b/a', 'b/b'], '(a|b)/b').should.eql(['a/b', 'b/b']);
      mm(['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'c/b'], '((a|b)|c)/b').should.eql(['a/b', 'b/b', 'c/b']);
      mm(['a/b.md', 'a/c.md', 'a/d.md'], 'a/(b|d).md').should.eql(['a/b.md', 'a/d.md']);
      mm(['a-1.md', 'a-2.md', 'a-3.md', 'a-4.md', 'a-5.md'], 'a-(2|3|4).md').should.eql(['a-2.md', 'a-3.md', 'a-4.md']);
      mm(['a/b.md', 'b/b.md', 'c/b.md', 'b/c.md', 'a/d.md'], '(b|c)/(b|d).md').should.eql(['b/b.md', 'c/b.md']);
      mm(['a/b.md', 'b/b.md', 'c/b.md', 'b/c.md', 'a/d.md'], '{b,c}/{b,d}.md').should.eql(['b/b.md', 'c/b.md']);
    });
  });
});
