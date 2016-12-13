var micromatch = require('../../..');

module.exports = function(files, pattern) {
  return micromatch.match(files, pattern);
};
