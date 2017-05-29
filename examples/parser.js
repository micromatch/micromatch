'use strict';

var parsers = require('../lib/parsers');
var Extglob = require('../lib/extglob');
var extglob = new Extglob();
extglob.use(parsers);

var pattern = '*(*(of*(a)x)z)';
var res = extglob.parse(pattern);
console.log(res);
