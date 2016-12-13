var micromatch = require('../../..');

module.exports = function(file, pattern) {
  return micromatch.isMatch(file, pattern);
};
