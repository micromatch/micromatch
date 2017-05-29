'use strict';

var mm = require('..');
var pattern = '*(*(of*(a)x)z)';

// var res = mm(pattern);
// console.log(res.ast.nodes);
// console.log(res);
console.log(mm(['a/b.js', 'a/b.md'], 'a/*.!(js)'))
