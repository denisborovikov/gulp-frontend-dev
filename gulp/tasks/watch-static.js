var browserSync = require('browser-sync');
var reload      = browserSync.reload;

module.exports = function(gulp, options, $) {
    gulp.task('watch-static', function() {
        if (options.browserSync) browserSync(options.browserSync);

        gulp.watch(options.files.scss, ['default']);
        gulp.watch(options.files.svg, ['svg']);
        gulp.watch(options.files.sprites, ['sprites']);
        gulp.watch(options.files.img, ['images']);
        gulp.watch(options.files.html, ['html']);
        gulp.watch(options.files.js, reload);
    });
};