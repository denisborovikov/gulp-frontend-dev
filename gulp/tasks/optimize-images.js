var browserSync = require('browser-sync');
var reload      = browserSync.reload;

module.exports = function(gulp, options, $) {
    gulp.task('images', function () {
        return gulp.src(options.files.img)
            .pipe($.newer(options.paths.img))
            .pipe(($.imagemin({progressive: true})))
            .pipe(gulp.dest(options.paths.img))
            .pipe(reload({stream: true}));
    });
};