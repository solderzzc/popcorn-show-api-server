var fs = require('fs');
var path = require('path');

fs.readdirSync(__dirname)
  .filter(function(file) {
    return (path.join(__dirname, file) != __filename);
  })
  .forEach(function(file) {
    var controllerName = path.basename(file, path.extname(file));
    module.exports[controllerName] = require(path.join(__dirname, file));
  });