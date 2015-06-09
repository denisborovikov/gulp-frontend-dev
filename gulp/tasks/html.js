var browserSync = require('browser-sync');
var reload = browserSync.reload;

module.exports = function (gulp, options, $) {
    gulp.task('html', function () {
        return gulp.src(options.paths.html + '*.html')
            .pipe($.fileInclude({
                prefix  : '@@',
                basepath: '@file'
            }))
            .pipe($.htmlI18n({
                langDir       : './lang',
                createLangDirs: true
            }))
            .pipe(gulp.dest('./dest'))
            .pipe(reload({stream: true}));
    });
};
