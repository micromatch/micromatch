'use strict';

module.exports = extglob;


/**
 * Match exglob patterns:
 *  - `?(...)` match zero or one of the given patterns.
 *  - `*(...)` match zero or more of the given patterns.
 *  - `+(...)` match one or more of the given patterns.
 *  - `@(...)` match one of the given patterns.
 *  - `!(...)` match anything except one of the given patterns.
 *
 * @param {String} `glob`
 * @param {String} `flags`
 */

function extglob(glob, type) {
  // console.log('before:', glob)
  // var re = /([^?*+@!]*)([?*+@!]{1})(\(([^)]+)\))/;
  // var match = re.exec(glob);

  // if (match) {
  //   var prefix = match[2];
  //   var inner = match[4];
  //   if (inner.indexOf('{') !== -1) {
  //     return glob;
  //   }

  //   // inner = esc(inner.replace(/\*/g, '.*'));
  //   console.log(match)
  //   // var res = esc('[^/]*?');
  //   var res = '';
  //   switch(prefix) {
  //     case '?':
  //       res += esc('(?:' + inner + ')?');
  //       break;
  //     case '*':
  //     case '+':
  //       res += esc('(?:') + inner + ')';
  //       break;
  //     case '!':
  //       // res += esc('(?:' + inner + ')?')
  //       res += esc('((?!') + inner + esc(').*?)');
  //       break;
  //     case '@':
  //       break;
  //     default:
  //       return glob;
  //       break;
  //   }
  //   glob = glob.replace(match[0], res);

  //   console.log('after:', unesc(glob));
  //   return glob;
  //   // glob = glob.replace(match[0], '(' + inner + ')' + prefix);

  // }

  return glob.replace(/(\.)?([?*+@!]{1})(\(([^)]+)\))/, function (match, $1, prefix, $3, $4) {
    // console.log('args:', [].slice.call(arguments))
    if (!prefix || !$3 || !$4 || $4.indexOf('{') !== -1) {
      return match;
    }
    var res;

    if (prefix === '?') { res = '(?:' + $4 + ')?'; }

    if (prefix === '*' || prefix === '+') {
      res = esc('(?:') + $4 + ')';
    }

    if (prefix === '!') {
      res = esc('((?!') + $4 + esc(').*?)');
    }
        console.log('after:', unesc(res));

    return res || match;
  });
}

function esc(glob) {
  return glob;
}
function unesc(glob) {
  return glob;
}