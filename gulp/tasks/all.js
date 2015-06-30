var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

module.exports = function (gulp, options, $) {
  gulp.task('all', function (callback) {
    runSequence(['images', 'svg', 'sprites'], 'default', callback);
  });
};
