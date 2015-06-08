var path = require('path');
var fs = require('fs');
var Stream = require("stream");

// Recursively read directories and return an array of directories
// Ignore directories started with _
function dirsList(root, dirs, prefix) {
    prefix = prefix || '';
    dirs = dirs || [];

    var dir = path.join(root, prefix);

    if (fs.statSync(dir).isDirectory() &&
        path.basename(prefix).substr(0, 1) !== '_') {
        dirs.push(prefix);
        fs.readdirSync(dir).forEach(function (name) {
            dirsList(root, dirs, path.join(prefix, name))
        });
    }

    return dirs;
}

// Run pipe callback, get stream as parameter
// Return modified stream or undefined.
function gulpCallback(obj) {
    var stream = new Stream.Transform({objectMode: true});

    stream._transform = function(file, unused, callback) {
        var result = obj(file);
        file = result === undefined ? file : result;
        callback(null, file);
    };

    return stream;
};

module.exports = {
    dirsList: dirsList,
    gulpCallback: gulpCallback
};
