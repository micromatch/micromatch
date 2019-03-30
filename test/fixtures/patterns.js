'use strict';

/**
 * The contents of this file was copied (and modified) from:
 * minimatch v3.0.3, ISC LICENSE, Copyright (c) Isaac Z. Schlueter and Contributors
 * https://github.com/isaacs/minimatch
 */

let fixtures = ['a', 'b', 'c', 'd', 'abc', 'abd', 'abe', 'bb', 'bcd', 'ca', 'cb', 'dd', 'de', 'bdir/', 'bdir/cfile'];

// pattern | expected | options | fixtures
module.exports = [
  'http://www.bashcookbook.com/bashinfo/source/bash-1.14.7/tests/glob-test',
  ['a*', ['a', 'abc', 'abd', 'abe']],
  ['X*', ['X*'], {nonull: true}],

  'allow null glob expansion',
  ['X*', []],

  'micromatch has same results as Bash. Minimatch does this differently',
  ['\\*', ['\\*'], {nonull: true}],
  ['\\**', ['\\**'], {nonull: true}],
  ['\\*\\*', ['\\*\\*'], {nonull: true}],

  ['b*/', ['bdir/']],
  ['c*', ['c', 'ca', 'cb']],
  ['**', fixtures],

  ['\\.\\./*/', ['\\.\\./*/'], {nonull: true}],
  ['s/\\..*//', ['s/\\..*//'], {nonull: true}],

  'legendary larry crashes bashes',
  ['/^root:/{s/^[^:]*:[^:]*:\([^:]*\).*$/\\1/',
    ['/^root:/{s/^[^:]*:[^:]*:\([^:]*\).*$/\\1/'], {nonull: true, bash: {skip: true}}],
  ['/^root:/{s/^[^:]*:[^:]*:\([^:]*\).*$/\u0001/',
    ['/^root:/{s/^[^:]*:[^:]*:\([^:]*\).*$/\u0001/'], {nonull: true, bash: {skip: true}}],

  /**
   * Character classes
   */

  'character classes',
  ['[a-c]b*', ['abc', 'abd', 'abe', 'bb', 'cb']],
  ['[a-y]*[^c]', ['abd', 'abe', 'bb', 'bcd', 'bdir/', 'ca', 'cb', 'dd', 'de'], {bash: true}],
  ['a*[^c]', ['abd', 'abe']],
  () => {
    fixtures.push('a-b', 'aXb');
  },
  ['a[X-]b', ['a-b', 'aXb']],
  () => {
    fixtures.push('.x', '.y');
  },
  ['[^a-c]*', ['d', 'dd', 'de']],
  () => {
    fixtures.push('a*b/', 'a*b/ooo', 'ab/ooo');
  },

  'trailing slashes',
  ['a*b/*', ['ab/ooo', 'a*b/ooo']],
  ['a*?/*', ['ab/ooo', 'a*b/ooo']],
  ['a\\*b/*', ['a*b/ooo']],
  ['a\\*?/*', ['a*b/ooo']],
  ['*\\\\!*', [], {null: true}, ['echo !7']],
  ['*\\!*', ['echo !7'], null, ['echo !7']],
  ['*.\\*', ['r.*'], null, ['r.*']],
  ['a[b]c', ['abc']],
  ['a[\\\\b]c', ['abc']],
  ['a?c', ['abc']],
  ['a\\*c', [], {null: true}, ['abc']],

  /**
   * Bash tests
   */

  'http://www.opensource.apple.com/source/bash/bash-23/bash/tests/glob-test',
  () => {
    fixtures.push('man/', 'man/man1/', 'man/man1/bash.1');
  },
  ['*/man*/bash.*', ['man/man1/bash.1']],
  ['man/man1/bash.1', ['man/man1/bash.1']],
  ['a***c', ['abc'], null, ['abc']],
  ['a*****?c', ['abc'], null, ['abc']],
  ['?*****??', ['abc'], null, ['abc']],
  ['*****??', ['abc'], null, ['abc']],
  ['?*****?c', ['abc'], null, ['abc']],
  ['?***?****c', ['abc'], null, ['abc']],
  ['?***?****?', ['abc'], null, ['abc']],
  ['?***?****', ['abc'], null, ['abc']],
  ['*******c', ['abc'], null, ['abc']],
  ['*******?', ['abc'], null, ['abc']],
  ['a*cd**?**??k', ['abcdecdhjk'], null, ['abcdecdhjk']],
  ['a**?**cd**?**??k', ['abcdecdhjk'], null, ['abcdecdhjk']],
  ['a**?**cd**?**??k***', ['abcdecdhjk'], null, ['abcdecdhjk']],
  ['a**?**cd**?**??***k', ['abcdecdhjk'], null, ['abcdecdhjk']],
  ['a**?**cd**?**??***k**', ['abcdecdhjk'], null, ['abcdecdhjk']],
  ['a****c**?**??*****', ['abcdecdhjk'], null, ['abcdecdhjk']],
  ['[-abc]', ['-'], null, ['-']],
  ['[abc-]', ['-'], null, ['-']],
  ['[[]', ['['], null, ['[']],
  ['[', ['['], null, ['[']],
  ['[*', ['[abc'], null, ['[abc']],

  'a right bracket shall lose its special meaning and represent itself in a bracket expression if it occurs first in the list.  -- POSIX.2 2.8.3.2',
  ['[]]', [']'], null, [']']],
  ['[]-]', [']'], null, [']']],
  ['[a-\z]', ['p'], null, ['p']],
  ['??**********?****?', [], { null: true }, ['abc']],
  ['??**********?****c', [], { null: true }, ['abc']],
  ['?************c****?****', [], { null: true }, ['abc']],
  ['*c*?**', [], { null: true }, ['abc']],
  ['a*****c*?**', [], { null: true }, ['abc']],
  ['a********???*******', [], { null: true }, ['abc']],
  ['[]', [], { null: true }, ['a']],
  ['[abc', [], { null: true }, ['[']],

  'nocase tests',
  ['XYZ', ['xYz'], { nocase: true, null: true },
    ['xYz', 'ABC', 'IjK']],
  [
    'ab*',
    ['ABC'],
    { nocase: true, null: true },
    ['xYz', 'ABC', 'IjK']
  ],
  [
    '[ia]?[ck]',
    ['ABC', 'IjK'],
    { nocase: true, null: true },
    ['xYz', 'ABC', 'IjK']
  ],

  'braces: onestar/twostar',
  ['{/*,*}', [], {null: true}, ['/asdf/asdf/asdf']],
  ['{/?,*}', ['/a', 'bb'], {null: true}, ['/a', '/b/b', '/a/b/c', 'bb']],

  'dots should not match unless requested',
  ['**', ['a/b'], {}, ['a/b', 'a/.d', '.a/.d']],

  // .. and . can only match patterns starting with .,
  // even when options.dot is set.
  () => {
    fixtures = ['a/./b', 'a/../b', 'a/c/b', 'a/.d/b'];
  },
  ['a/*/b', ['a/c/b', 'a/.d/b'], {dot: true}],
  ['a/*/b', ['a/c/b'], {dot: false}],

  ['a/.*/b', ['a/./b', 'a/../b', 'a/.d/b'], {dot: true}],
  ['a/.*/b', ['a/./b', 'a/../b', 'a/.d/b'], {dot: false}],

  // this also tests that changing the options needs
  // to change the cache key, even if the pattern is
  // the same!
  ['**',
    ['a/b', 'a/.d', '.a/.d'],
    { dot: true },
    [ '.a/.d', 'a/.d', 'a/b']
  ],

  // '~~paren sets cannot contain slashes~~',
  // 'paren sets _can_ contain slashes',
  ['*(a/b)', ['a/b'], {}, ['a/b']],

  // brace sets trump all else.
  //
  // invalid glob pattern.  fails on bash4 and bsdglob.
  // however, in this implementation, it's easier just
  // to do the intuitive thing, and let brace-expansion
  // actually come before parsing any extglob patterns,
  // like the documentation seems to say.
  //
  // XXX: if anyone complains about this, either fix it
  // or tell them to grow up and stop complaining.
  //
  // bash/bsdglob says this:
  // ["*(a|{b),c)}", ["*(a|{b),c)}"], {}, ["a", "ab", "ac", "ad"]],
  // but we do this instead:
  ['*(a|{b),c)}', ['a', 'ab', 'ac'], {expand: true}, ['a', 'ab', 'ac', 'ad']],

  // test partial parsing in the presence of comment/negation chars
  ['[!a*', ['[!ab'], {}, ['[!ab', '[ab']],

  // like: {a,b|c\\,d\\\|e} except it's unclosed, so it has to be escaped.
  // [
  //   '+(a|*\\|c\\\\|d\\\\\\|e\\\\\\\\|f\\\\\\\\\\|g',
  //   ['+(a|b\\|c\\\\|d\\\\|e\\\\\\\\|f\\\\\\\\|g'],
  //   {},
  //   ['+(a|b\\|c\\\\|d\\\\|e\\\\\\\\|f\\\\\\\\|g', 'a', 'b\\c']
  // ],

  // crazy nested {,,} and *(||) tests.
  () => {
    fixtures = [
      'a', 'b', 'c', 'd', 'ab', 'ac', 'ad', 'bc', 'cb', 'bc,d',
      'c,db', 'c,d', 'd)', '(b|c', '*(b|c', 'b|c', 'b|cc', 'cb|c',
      'x(a|b|c)', 'x(a|c)', '(a|b|c)', '(a|c)'
    ];
  },
  ['*(a|{b,c})', ['a', 'b', 'c', 'ab', 'ac'], {expand: true}],
  // ['{a,*(b|c,d)}', ['a', '(b|c', '*(b|c', 'd)'], {expand: true}], //<= minimatch (wrong)
  ['{a,*(b|c,d)}', ['a', 'b', 'bc,d', 'c,db', 'c,d'], {expand: true}],

  // a
  // *(b|c)
  // *(b|d)
  ['{a,*(b|{c,d})}', ['a', 'b', 'bc', 'cb', 'c', 'd'], {expand: true}],
  ['*(a|{b|c,c})', ['a', 'b', 'c', 'ab', 'ac', 'bc', 'cb']],
  ['*(a|{b|c,c})', ['a', 'b', 'c', 'ab', 'ac', 'bc', 'cb'], {expand: true}],

  // test various flag settings.

  ['a?b', ['acb', 'acb/'], {}, ['x/y/acb', 'acb', 'acb/', 'acb/d/e']],
  ['a?b', ['x/y/acb', 'acb/', 'acb'], {matchBase: true}, ['x/y/acb', 'acb', 'acb/', 'acb/d/e']],

  // begin channelling Boole and deMorgan...
  'negation tests',
  () => {
    fixtures = ['d', 'e', '!ab', '!abc', 'a!b'];
  },

  // anything that is NOT a* matches.
  ['!a*', ['d', 'e', '!ab', '!abc']],

  // anything that IS !a* matches.
  ['!a*', ['!ab', '!abc'], {nonegate: true}],

  // anything that IS a* matches
  ['a*', ['a!b']],

  // anything that is NOT !a* matches
  ['!\\!a*', ['a!b', 'd', 'e']],

  // negation nestled within a pattern
  () => {
    fixtures = [
      'foo.js',
      'foo.bar',
      'foo.js.js',
      'blar.js',
      'foo.',
      'boo.js.boo'
    ];
  },
  // last one is tricky! * matches foo, . matches ., and 'js.js' != 'js'
  // copy bash 4.3 behavior on this.

  'https://github.com/isaacs/minimatch/issues/5',
  () => {
    fixtures = [
      'a/b/.x/c', 'a/b/.x/c/d', 'a/b/.x/c/d/e', 'a/b/.x', 'a/b/.x/',
      'a/.x/b', '.x', '.x/', '.x/a', '.x/a/b', 'a/.x/b/.x/c', '.x/.x'
    ];
  },
  [
    '**/.x/**',
    [
      '.x/', '.x/a', '.x/a/b', 'a/.x/b', 'a/b/.x/', 'a/b/.x/c',
      'a/b/.x/c/d', 'a/b/.x/c/d/e'
    ]
  ],

  'https://github.com/isaacs/minimatch/issues/59',
  ['[z-a]', []],
  ['a/[2015-03-10T00:23:08.647Z]/z', []],
  ['[a-0][a-\u0100]', []]
];

Object.defineProperty(module.exports, 'fixtures', {
  get: () => {
    return fixtures;
  }
});
