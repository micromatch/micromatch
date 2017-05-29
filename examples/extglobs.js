var mm = require('..');

console.log(mm.isMatch('src/a/b/c.js', 'src/**/*!(_test).js'));
//=> true
console.log(mm.isMatch('src/a/b/c.js', 'src/**/.!(_test).js'));
//=> false
console.log(mm.isMatch('src/a/b/c_test.js', 'src/**/*!(_test).js'));
//=> true
console.log(mm.isMatch('src/a/b/c_test.js', 'src/**/.!(_test).js'));
//=> false

console.log(mm.isMatch('src/a/b/c_test.js', 'src/**/.!(_test).js'));
//=> false

console.log(mm('a**(z)'));
//=> false

// var arr = ['a.a', 'a.b', 'a.c.d', 'c.c', 'a.', 'd.d', 'e.e', 'f.f']
// console.log(mm(arr, '!(*.a|*.b|*.c)'));
