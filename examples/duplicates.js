var mm = require('..');
console.log(mm.match(['a.js', 'a.txt'], './**/**/**/*.js'));
//=> [ 'a.js' ]
