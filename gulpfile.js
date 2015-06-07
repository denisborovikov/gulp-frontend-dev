var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var fs          = require('fs');
var extend      = require('extend');

var options = extend(true, require('./gulp-config.js'), require('./gulp-config-local.js'));

// Add tasks here.
// See task module example in the `task` directory.
fs.readdirSync('./tasks/').forEach(function(file){
    require('./tasks/' + file)(gulp, options, $);
});
