var path         = require('path');
var browserSync  = require('browser-sync');
var reload       = browserSync.reload;
//var gulpCallback = require('../utils/utils').gulpCallback;
//var lwip         = require('lwip');
//var File         = require('vinyl');

module.exports = function(gulp, options, $) {
    gulp.task('images', function () {
        return gulp.src(options.files.img)
            .pipe($.newer(options.paths.img))
            //.pipe(gulpCallback(ScaleRetinaImage))
            .pipe(($.imagemin({progressive: true})))
            .pipe(gulp.dest(options.paths.img))
            .pipe(reload({stream: true}));
    });


    // Automatically create half-sized copy of retina image
    function ScaleRetinaImage(file, stream) {
        var dir = path.dirname(file.path);
        var name = path.basename(file.path).split('.');
        var reg = new RegExp('((?!' + options.sprites.prefix + ').)*@2x');

        if (reg.exec(name[0]) !== null) {

            lwip.open(file.path, function(err, image) {

                image.scale(0.5, function(err, image) {

                    image.toBuffer(name[1], function (err, buffer) {
                        var image = new File({
                            base    : file.base,
                            path    : path.join(dir, name[0].slice(0, -3) + '.' + name[1]),
                            contents: buffer
                        });

                        stream.push(image);
                    });
                });
            });
        }
    }
};