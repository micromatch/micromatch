'use strict';

const { Suite } = require('benchmark');
const argv = require('minimist')(process.argv.slice(2));
const colors = require('ansi-colors');
const parent = require('glob-parent');
const scan = require('../lib/scan');

/**
 * Setup
 */

const cycle = (e, newline) => {
  process.stdout.write(`\u001b[G  ${e.target}${newline ? '\n' : ''}`);
};

function bench(name, options) {
  const config = { name, ...options };

  const suite = new Suite(config);
  const add = suite.add.bind(suite);
  suite.on('error', console.error);

  if (argv.run && name !== argv.run) {
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
}

bench(colors.cyan('foo/*.js'))
  .add('  picomatch', () => scan('foo/*.js'))
  .add('glob-parent', () => parent('foo/*.js'))
  .run();

bench(colors.cyan('foo/{a,b}/*.js'))
  .add('  picomatch', () => scan('foo/{a,b}/*.js'))
  .add('glob-parent', () => parent('foo/{a,b}/*.js'))
  .run();
