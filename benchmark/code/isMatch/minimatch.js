var minimatch = require('minimatch');

module.exports = function(file, pattern) {
  return minimatch(file, pattern);
};
