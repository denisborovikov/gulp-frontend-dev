// Task to create sprite images and SCSS files.
// Only PNG files can be used as a source.
// Directory name should start from options.sprites.prefix (`sprite-` by default) to be processed.
// Add @2x to the end of a directory name and put double sized images inside
// to automatically create normal and retina sprite images and SCSS for both versions.
// Generated sprite will be sored at options.sprites.dest ('i/dest' by default) directory.
// SCSS will be stored at the same directory as source images.
// Run `gulp sprites` to run the task for all directories.
// (disabled yet) Run `gulp sprites --only=DIR` to run task for specific sprite directory,
// i.e. `gulp sprites --only=logos`, where `logos` is a name of directory.


var fs          = require('fs');
var path        = require('path');
var sprite      = require('css-sprite').stream;
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var dirsList    = require('../utils/utils').dirsList;

module.exports = function(gulp, options, $) {
    gulp.task('sprites', function (callback) {
        //var dirs = options.argv.only ? [options.argv.only] : readDirs(options.sprites.src);
        var dirs = dirsList(options.sprites.src);

        dirs.forEach(function (dir) {
            // Process directories with prefix only
            var prefixLength = options.sprites.prefix.length;
            if (path.basename(dir).slice(0, prefixLength) !== options.sprites.prefix) return;

            var retina = false;
            var spriteName = path.basename(dir).slice(prefixLength);

            // If directory name ends with @2x, there are retina images inside
            if (spriteName.slice(-3) === '@2x') {
                spriteName = spriteName.slice(0, -3);
                retina = true;
            }

            gulp.src(options.sprites.src + dir + path.sep + '*.png')
                .pipe(sprite({
                    prefix       : options.sprites.prefix + spriteName,
                    name         : options.sprites.prefix + spriteName,
                    style        : '_' + options.sprites.prefix + spriteName + '.scss',
                    cssPath      : options.sprites.url + dir,
                    orientation  : options.sprites.orientation,
                    margin       : options.sprites.margin,
                    template     : options.sprites.template,
                    interpolation: options.sprites.interpolation,
                    retina       : retina
                }))
                .pipe($.imagemin())
                .pipe($.if('*.png', gulp.dest(options.sprites.dest + path.dirname(dir)), gulp.dest(options.sprites.src + path.dirname(dir))))
                .pipe(reload({stream: true}));
        });

        callback();
    });
};
