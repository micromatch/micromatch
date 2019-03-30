'use strict';

const mm = require('..');
// console.log(mm.parse('*(*(of*(a)x)z)'));
console.log(mm.parse('{a,b,c}/{001..10}'));
