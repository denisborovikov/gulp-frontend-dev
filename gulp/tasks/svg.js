// This task used to combine separated svg-files to the single svg-sprite
// and put it to file with `html` extension. This file should be injected into
// your template at the top of the document and hidden.
// More info https://css-tricks.com/svg-sprites-use-better-icon-fonts/
//
// Only svg files with prefix `options.sprites.prefix` (`sprite-` by default)
// will be processed. This prefix will be removed in the final sprite.

var fs           = require('fs');
var path         = require('path');
var browserSync  = require('browser-sync');
var reload       = browserSync.reload;
var gulpCallback = require('../utils/utils').gulpCallback;

module.exports = function(gulp, options, $) {
    var baseDir = options.paths.scss;

    gulp.task('svg', function (callback) {
        var files = options.argv.only ? [options.argv.only] : fs.readdirSync(baseDir);

        files.forEach(function (file) {
            if (!fs.statSync(baseDir + file).isDirectory()) return;

            // Closure to store and check svg names
            var checkSameSVGIds = (function() {
                var ids = [];

                return function(str) {
                    if (~ids.indexOf(str)) {
                        return false;
                    } else {
                        return ids.push(str);
                    }
                }
            })();

            gulp.src(path.join(baseDir, file, '**', options.sprites.prefix + '*.svg'))

                // Remove `sprite-` from the filename.
                .pipe($.rename(function(path) {
                          path.basename = path.basename.slice(7);
                      }))

                // Svgstore doesn't allow to have svg with the same id in one sprite.
                // This function checks if there are svg files with the same id.
                // If so, all svg after first one will be skipped.
                // This make possible to have the same svg files in different components
                // directories, e.g. social networks icons in two different components.
                // Important: if svg are different they must have different ids.
                .pipe(gulpCallback(function(file) {
                          var SVGId = path.basename(file.path, '.svg');
                          var checkSVGIdOK = checkSameSVGIds(SVGId);
                          if (!checkSVGIdOK) return null;
                      }))
                .pipe($.svgmin({
                          plugins: [
                              {removeViewBox: false},
                              {removeUselessStrokeAndFill: false}
                          ]
                      }))
                .pipe($.svgstore())
                .pipe($.rename('svg-sprite-' + file + '.html'))
                .pipe(gulp.dest(options.paths.html))
                .pipe(reload({stream: true}));
        });
        callback();
    });
};
