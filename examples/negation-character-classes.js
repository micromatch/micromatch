var mm = require('..');

console.log(mm(['bar/bar'], ['foo/**', '!foo/baz']));
console.log(mm(['bar/bar'], ['!foo/baz', 'foo/**']));
console.log(mm(['bar/bar'], ['!**', '!foo/baz', 'foo/**']));
console.log(mm(['bar/bar'], ['**', '!foo/baz', 'foo/**']));
console.log(mm(['bar/bar'], ['!foo/baz', 'foo/**']));

// 1. No error, but pattern has a different behavior and my tests are failing because of this: https://ci.appveyor.com/project/electerious/rosid/build/1.0.72/job/srfjb4x7p6t1l5r5
//'*/[^_]*.{html,ejs}*'
//'a/[^_]*.{html,ejs}*'
// '!_*.{html,ejs}'

// 2. Throws no parsers registered for: "]*.{h".
// [^_]*.{html,ejs}

// 3. Works on macOS, but fails on windows because of a different behavior: https://ci.appveyor.com/project/electerious/rosid/build/1.0.74/job/17hbg0e822r8pdw3 => I guess this shouldn't be the case. Is [^_] evil?
// '[^_]*.html + [^_]*.ejs'

// 4. Could be a workaround, but !_*.{html,ejs} seems to be different to what [^_]*.{html,ejs}* does.
// '!_*.{html,ejs}'
