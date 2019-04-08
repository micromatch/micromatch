'use strict';

const { Suite } = require('benchmark');
const colors = require('ansi-colors');
const argv = require('minimist')(process.argv.slice(2));
const mm = require('minimatch');
const pm = require('..');

/**
 * Setup
 */

const cycle = (e, newline) => {
  process.stdout.write(`\u001b[G  ${e.target}${newline ? '\n' : ''}`);
};

const bench = (name, options) => {
  const config = { name, ...options };
  const suite = new Suite(config);
  const add = suite.add.bind(suite);
  suite.on('error', console.error);

  if (argv.run && !new RegExp(argv.run).test(name)) {
    suite.add = () => suite;
    return suite;
  }

  console.log(`\n# ${config.name}`);
  suite.add = (key, fn, opts) => {
    if (typeof fn !== 'function') opts = fn;

    add(key, {
      onCycle: e => cycle(e),
      onComplete: e => cycle(e, true),
      fn,
      ...opts
    });
    return suite;
  };

  return suite;
};

bench(colors.green('.makeRe') + ' star')
  .add('micromatch', () => pm.makeRe('*'))
  .add('minimatch', () => mm.makeRe('*'))
  .run();

bench(colors.green('.makeRe') + ' star; dot=true')
  .add('micromatch', () => pm.makeRe('*', { dot: true }))
  .add('minimatch', () => mm.makeRe('*', { dot: true }))
  .run();

bench(colors.green('.makeRe') + ' globstar')
  .add('micromatch', () => pm.makeRe('**'))
  .add('minimatch', () => mm.makeRe('**'))
  .run();

bench(colors.green('.makeRe') + ' globstars')
  .add('micromatch', () => pm.makeRe('**/**/**'))
  .add('minimatch', () => mm.makeRe('**/**/**'))
  .run();

bench(colors.green('.makeRe') + ' with leading star')
  .add('micromatch', () => pm.makeRe('*.txt'))
  .add('minimatch', () => mm.makeRe('*.txt'))
  .run();

bench(colors.green('.makeRe') + ' - braces')
  .add('micromatch', () => pm.makeRe('{a,b,c}*.txt'))
  .add('minimatch', () => mm.makeRe('{a,b,c}*.txt'))
  .run();
