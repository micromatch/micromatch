'use strict';

const assert = require('assert');
const mm = require('..');
const { isMatch, hasBraces } = mm;

describe('braces', () => {
    it("should return true when braces are found", () => {
      assert.equal(hasBraces("{foo}"), true);
      assert.equal(hasBraces("foo}"), false);
      assert.equal(hasBraces("{foo"), false);
      assert.equal(hasBraces("a{}b"), true);
      assert.equal(hasBraces("abc {foo} xyz"), true);
      assert.equal(hasBraces("abc {foo xyz"), false);
      assert.equal(hasBraces("abc {foo} xyz"), true);
      assert.equal(hasBraces("abc foo} xyz"), false);
      assert.equal(hasBraces("abc foo xyz"), false);
      assert.equal(hasBraces("abc {foo} xyz {bar} pqr"), true);
      assert.equal(hasBraces("abc {foo xyz {bar} pqr"), true);
      assert.equal(hasBraces("abc foo} xyz {bar pqr"), false);
    });


  it('should handle extglobs in braces', () => {
    let fixtures = ['a', 'b', 'c', 'd', 'ab', 'ac', 'ad', 'bc', 'cb', 'bc,d', 'c,db', 'c,d', 'd)', '(b|c', '*(b|c', 'b|c', 'b|cc', 'cb|c', 'x(a|b|c)', 'x(a|c)', '(a|b|c)', '(a|c)'];

    assert.deepEqual(mm(fixtures, ['a', '*(b|c,d)']), ['a', 'b', 'bc,d', 'c,db', 'c,d']);
    assert.deepEqual(mm(fixtures, '{a,*(b|c,d)}'), ['a', 'b', 'bc,d', 'c,db', 'c,d']);
    assert.deepEqual(mm(fixtures, ['a', '*(b|c,d)'], { expand: true }), ['a', 'b', 'bc,d', 'c,db', 'c,d']);
    assert.deepEqual(mm(fixtures, '{a,*(b|c,d)}', { expand: true }), ['a', 'b', 'bc,d', 'c,db', 'c,d']);

    let expected = ['a', 'b', 'c', 'ab', 'ac', 'bc', 'cb'];
    assert.deepEqual(mm(fixtures, '*(a|b|c)'), expected);
    assert.deepEqual(mm(fixtures, '*(a|{b|c,c})'), expected);
    assert.deepEqual(mm(fixtures, '*(a|{b|c,c})', { expand: true }), expected);
  });

  it('should not match with brace sets when disabled', () => {
    assert(!isMatch('a/a', 'a/{a,b}', { nobrace: true }));
    assert(!isMatch('a/b', 'a/{a,b}', { nobrace: true }));
    assert(!isMatch('a/c', 'a/{a,b}', { nobrace: true }));
    assert(!isMatch('b/b', 'a/{a,b}', { nobrace: true }));
    assert(!isMatch('b/b', 'a/{a,b,c}', { nobrace: true }));
    assert(!isMatch('a/c', 'a/{a,b,c}', { nobrace: true }));
  });

  it('should not match with brace ranges when disabled', () => {
    assert(!isMatch('a/a', 'a/{a..c}', { nobrace: true }));
    assert(!isMatch('a/b', 'a/{a..c}', { nobrace: true }));
    assert(!isMatch('a/c', 'a/{a..c}', { nobrace: true }));
  });

  it('should match with brace sets', () => {
    assert(isMatch('a/a', 'a/{a,b}'));
    assert(isMatch('a/b', 'a/{a,b}'));
    assert(!isMatch('a/c', 'a/{a,b}'));
    assert(!isMatch('b/b', 'a/{a,b}'));
    assert(!isMatch('b/b', 'a/{a,b,c}'));
    assert(isMatch('a/c', 'a/{a,b,c}'));
  });

  it('should match with brace ranges', () => {
    assert(isMatch('a/a', 'a/{a..c}'));
    assert(isMatch('a/b', 'a/{a..c}'));
    assert(isMatch('a/c', 'a/{a..c}'));
  });

  it('should not convert braces inside brackets', () => {
    assert(isMatch('foo{}baz', 'foo[{a,b}]+baz'));
    assert(isMatch('{a}{b}{c}', '[abc{}]+'));
  });

  it('should support braces with empty elements', () => {
    assert(!isMatch('abc.txt', 'a{,b}.txt'));
    assert(!isMatch('abc.txt', 'a{a,b,}.txt'));
    assert(!isMatch('abc.txt', 'a{b,}.txt'));
    assert(isMatch('a.txt', 'a{,b}.txt'));
    assert(isMatch('a.txt', 'a{b,}.txt'));
    assert(isMatch('aa.txt', 'a{a,b,}.txt'));
    assert(isMatch('aa.txt', 'a{a,b,}.txt'));
    assert(isMatch('ab.txt', 'a{,b}.txt'));
    assert(isMatch('ab.txt', 'a{b,}.txt'));
  });

  it('should support braces containing slashes', () => {
    assert(isMatch('a', '{a/,}a/**'));
    assert(isMatch('aa.txt', 'a{a,b/}*.txt'));
    assert(isMatch('ab/.txt', 'a{a,b/}*.txt'));
    assert(isMatch('ab/a.txt', 'a{a,b/}*.txt'));
    assert(isMatch('a/', '{a/,}a/**'));
    assert(isMatch('a/a/', '{a/,}a/**'));
    assert(isMatch('a/a', '{a/,}a/**'));
    assert(isMatch('a/a/a', '{a/,}a/**'));
    assert(isMatch('a/a/', '{a/,}a/**'));
    assert(isMatch('a/a/a/', '{a/,}a/**'));
    assert(isMatch('a/b/a/', '{a/,}b/**'));
    assert(isMatch('b/a/', '{a/,}b/**'));
  });

  it('should support braces with slashes and empty elements', () => {
    assert(isMatch('a.txt', 'a{,/}*.txt'));
    assert(isMatch('ab.txt', 'a{,/}*.txt'));
    assert(isMatch('a/b.txt', 'a{,/}*.txt'));
    assert(isMatch('a/ab.txt', 'a{,/}*.txt'));
  });

  it('should support braces with escaped parens and stars', () => {
    assert(isMatch('a.txt', 'a{,.*{foo,db},\\(bar\\)}.txt'));
    assert(!isMatch('adb.txt', 'a{,.*{foo,db},\\(bar\\)}.txt'));
    assert(isMatch('a.db.txt', 'a{,.*{foo,db},\\(bar\\)}.txt'));

    assert(isMatch('a.txt', 'a{,*.{foo,db},\\(bar\\)}.txt'));
    assert(!isMatch('adb.txt', 'a{,*.{foo,db},\\(bar\\)}.txt'));
    assert(isMatch('a.db.txt', 'a{,*.{foo,db},\\(bar\\)}.txt'));

    assert(isMatch('a', 'a{,.*{foo,db},\\(bar\\)}'));
    assert(!isMatch('adb', 'a{,.*{foo,db},\\(bar\\)}'));
    assert(isMatch('a.db', 'a{,.*{foo,db},\\(bar\\)}'));

    assert(isMatch('a', 'a{,*.{foo,db},\\(bar\\)}'));
    assert(!isMatch('adb', 'a{,*.{foo,db},\\(bar\\)}'));
    assert(isMatch('a.db', 'a{,*.{foo,db},\\(bar\\)}'));

    assert(!isMatch('a', '{,.*{foo,db},\\(bar\\)}'));
    assert(!isMatch('adb', '{,.*{foo,db},\\(bar\\)}'));
    assert(!isMatch('a.db', '{,.*{foo,db},\\(bar\\)}'));
    assert(isMatch('.db', '{,.*{foo,db},\\(bar\\)}'));

    assert(!isMatch('a', '{,*.{foo,db},\\(bar\\)}'));
    assert(isMatch('a', '{*,*.{foo,db},\\(bar\\)}'));
    assert(!isMatch('adb', '{,*.{foo,db},\\(bar\\)}'));
    assert(isMatch('a.db', '{,*.{foo,db},\\(bar\\)}'));
  });

  it('should support braces in patterns with globstars', () => {
    assert(!isMatch('a/b/c/xyz.md', 'a/b/**/c{d,e}/**/xyz.md'));
    assert(!isMatch('a/b/d/xyz.md', 'a/b/**/c{d,e}/**/xyz.md'));
    assert(isMatch('a/b/cd/xyz.md', 'a/b/**/c{d,e}/**/xyz.md'));
    assert(isMatch('a/b/c/xyz.md', 'a/b/**/{c,d,e}/**/xyz.md'));
    assert(isMatch('a/b/d/xyz.md', 'a/b/**/{c,d,e}/**/xyz.md'));
  });

  it('should support globstars enclosed in braces, with slashes and empty elements', () => {
    assert(isMatch('a.txt', 'a{,/**/}*.txt'));
    assert(isMatch('a/b.txt', 'a{,/**/,/}*.txt'));
    assert(isMatch('a/x/y.txt', 'a{,/**/}*.txt'));
    assert(!isMatch('a/x/y/z', 'a{,/**/}*.txt'));
  });

  it('should support braces with globstars and empty elements', () => {
    assert(isMatch('a/b/foo/bar/baz.qux', 'a/b{,/**}/bar{,/**}/*.*'));
    assert(isMatch('a/b/bar/baz.qux', 'a/b{,/**}/bar{,/**}/*.*'));
  });

  it('should support Kleene stars', () => {
    assert(isMatch('ab', '{ab,c}*'));
    assert(isMatch('abab', '{ab,c}*'));
    assert(isMatch('ababab', '{ab,c}*'));
    assert(isMatch('ababc', '{ab,c}*'));
    assert(isMatch('abc', '{ab,c}*'));
    assert(isMatch('abcab', '{ab,c}*'));
    assert(isMatch('abcc', '{ab,c}*'));
    assert(isMatch('c', '{ab,c}*'));
    assert(isMatch('cab', '{ab,c}*'));
    assert(isMatch('cabab', '{ab,c}*'));
    assert(isMatch('cabc', '{ab,c}*'));
    assert(isMatch('cc', '{ab,c}*'));
    assert(isMatch('ccab', '{ab,c}*'));
    assert(isMatch('ccc', '{ab,c}*'));
  });

  it('should support Kleene plus', () => {
    assert(isMatch('ab', '{ab,c}+'));
    assert(isMatch('abab', '{ab,c}+'));
    assert(isMatch('abc', '{ab,c}+'));
    assert(isMatch('c', '{ab,c}+'));
    assert(isMatch('cab', '{ab,c}+'));
    assert(isMatch('cc', '{ab,c}+'));
    assert(isMatch('ababab', '{ab,c}+'));
    assert(isMatch('ababc', '{ab,c}+'));
    assert(isMatch('abcab', '{ab,c}+'));
    assert(isMatch('abcc', '{ab,c}+'));
    assert(isMatch('cabab', '{ab,c}+'));
    assert(isMatch('cabc', '{ab,c}+'));
    assert(isMatch('ccab', '{ab,c}+'));
    assert(isMatch('ccc', '{ab,c}+'));
    assert(isMatch('ccc', '{a,b,c}+'));

    assert(isMatch('a', '{a,b,c}+'));
    assert(isMatch('b', '{a,b,c}+'));
    assert(isMatch('c', '{a,b,c}+'));
    assert(isMatch('aa', '{a,b,c}+'));
    assert(isMatch('ab', '{a,b,c}+'));
    assert(isMatch('ac', '{a,b,c}+'));
    assert(isMatch('ba', '{a,b,c}+'));
    assert(isMatch('bb', '{a,b,c}+'));
    assert(isMatch('bc', '{a,b,c}+'));
    assert(isMatch('ca', '{a,b,c}+'));
    assert(isMatch('cb', '{a,b,c}+'));
    assert(isMatch('cc', '{a,b,c}+'));
    assert(isMatch('aaa', '{a,b,c}+'));
    assert(isMatch('aab', '{a,b,c}+'));
    assert(isMatch('abc', '{a,b,c}+'));
  });

  it('should support braces', () => {
    assert(isMatch('a', '{a,b,c}'));
    assert(isMatch('b', '{a,b,c}'));
    assert(isMatch('c', '{a,b,c}'));
    assert(!isMatch('aa', '{a,b,c}'));
    assert(!isMatch('bb', '{a,b,c}'));
    assert(!isMatch('cc', '{a,b,c}'));
  });

  it('should support regex quantifiers by escaping braces', () => {
    assert(!isMatch('a  ', '@(!(a) \\{1,2\\})*', { unescape: true }));
    assert(!isMatch('a ', '@(!(a) \\{1,2\\})*', { unescape: true }));
    assert(!isMatch('a', '@(!(a) \\{1,2\\})*', { unescape: true }));
    assert(!isMatch('aa', '@(!(a) \\{1,2\\})*', { unescape: true }));
    assert(!isMatch('aaa', '@(!(a) \\{1,2\\})*', { unescape: true }));
    assert(!isMatch('b', '@(!(a) \\{1,2\\})*', { unescape: true }));
    assert(!isMatch('bb', '@(!(a) \\{1,2\\})*', { unescape: true }));
    assert(!isMatch('bbb', '@(!(a) \\{1,2\\})*', { unescape: true }));
    assert(isMatch(' a ', '@(!(a) \\{1,2\\})*', { unescape: true }));
    assert(isMatch('b  ', '@(!(a) \\{1,2\\})*', { unescape: true }));
    assert(isMatch('b ', '@(!(a) \\{1,2\\})*', { unescape: true }));

    assert(isMatch('a   ', '@(!(a \\{1,2\\}))*'));
    assert(isMatch('a   b', '@(!(a \\{1,2\\}))*'));
    assert(isMatch('a  b', '@(!(a \\{1,2\\}))*'));
    assert(isMatch('a  ', '@(!(a \\{1,2\\}))*'));
    assert(isMatch('a ', '@(!(a \\{1,2\\}))*'));
    assert(isMatch('a', '@(!(a \\{1,2\\}))*'));
    assert(isMatch('aa', '@(!(a \\{1,2\\}))*'));
    assert(isMatch('b', '@(!(a \\{1,2\\}))*'));
    assert(isMatch('bb', '@(!(a \\{1,2\\}))*'));
    assert(isMatch(' a ', '@(!(a \\{1,2\\}))*'));
    assert(isMatch('b  ', '@(!(a \\{1,2\\}))*'));
    assert(isMatch('b ', '@(!(a \\{1,2\\}))*'));
  });
});
