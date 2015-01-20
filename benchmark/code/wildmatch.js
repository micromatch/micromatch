
var wm = require('wildmatch');

module.exports = function(files, pattern) {
  return files.filter(function (fp) {
    return wm(fp, pattern);
  });
};
