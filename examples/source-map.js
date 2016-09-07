'use strict';

var extglob = require('..');
var pattern = '*(*(of*(a)x)z)';

var res = extglob(pattern, {sourcemap: true});
console.log(res);
