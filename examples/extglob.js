'use strict';

var nanomatch = require('..');
var pattern = '*(*(of*(a)x)z)';

var res = nanomatch(pattern);
console.log(res.ast.nodes);
console.log(res);
