var multimatch = require('multimatch');

module.exports = function(files, pattern) {
  return multimatch(files, pattern);
};
