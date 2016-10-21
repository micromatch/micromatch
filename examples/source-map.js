'use strict';

var mm = require('..');
var pattern = '*(*(of*(a)x)z)';

var ast = mm.parse(pattern, {sourcemap: true});
var res = mm.compile(ast);
console.log(res);
// { map:
//    { version: 3,
//      sources: [ 'string' ],
//      names: [],
//      mappings: 'AAAA,CAAE,CAAE,EAAE,CAAE,CAAC,EAAC,CAAC,EAAC,CAAC,EAAC',
//      sourcesContent: [ '*(*(of*(a)x)z)' ] }},
