'use strict';

var fs = require('fs');
var os = require('os');
var path = require('path');
var del = require('delete');
var argv = require('yargs-parser')(process.argv.slice(2));
var spawn = require('./spawn');

var file = path.resolve(__dirname, argv._[0] || 'extglob.sh');

function spawnCommand(cwd, filepath, cb) {
  var absolute = path.resolve(cwd, filepath);
  var relative = path.relative(cwd, absolute);
  var dest = path.resolve(os.homedir(), relative).replace(/\.sh$/, '');

  fs.readFile(absolute, function(err, contents) {
    if (err) return cb(err);

    fs.writeFileSync(dest, contents);
    fs.chmod(dest, parseInt('777', 8), function(err) {
      if (err) return cb(err);

      spawn(dest, function(err, code) {
        if (err) return cb(err);

        del(dest, {force: true}, function(err) {
          if (err) return cb(err);
          cb(null, code);
        });
      });
    });
  });
}

spawnCommand(__dirname, file, function(err, code) {
  console.log(err);
  console.log(code);
});
