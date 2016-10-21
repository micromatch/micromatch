var minimatch = require('minimatch');

module.exports = function(files, pattern) {
  return minimatch.match(files, pattern);
};
