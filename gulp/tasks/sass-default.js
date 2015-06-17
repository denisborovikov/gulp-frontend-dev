// Task to compile and process SCSS files.
// Run `gulp` to run the task for all non partial SCSS.
// Run `gulp --only=SCSS` to run task for specific SCSS file,
// i.e. `gulp --only=import.scss`.

var fs           = require('fs');
var path         = require('path');
var browserSync  = require('browser-sync');
var reload       = browserSync.reload;
var gulpCallback = require('../utils/utils').gulpCallback;

// PostCSS processors
var autoprefixer = require('autoprefixer-core');
var mqpacker     = require('css-mqpacker');
var assets       = require('postcss-assets');

module.exports = function(gulp, options, $) {
   gulp.task('default', function (callback) {
       var files = options.argv.only ? [options.argv.only] : fs.readdirSync(options.paths.scss);

       files.forEach(function (file) {
           var name = path.basename(file, '.scss');

           // Skip directories, not .scss and _ partials
           if (fs.statSync(options.paths.scss + file).isDirectory() || path.extname(file) !== '.scss' || (name.substr(0, 1) === '_' && !options.argv.only)) return false;

           gulp.src(options.paths.scss + name + '.scss')
               .pipe($.plumber())
               .pipe($.sassBulkImport())
               .pipe($.sass({precision: 10}))
               .pipe($.postcss([
                                   autoprefixer(options.postcss.autoprefixer),
                                   mqpacker,
                                   assets(options.postcss.assets)
                               ]))
               .pipe($.if(~options.localize.indexOf(name + '.scss'), $.splitLocales()))
               .pipe($.if(options.rtlize, $.cssFlipper()))
               .pipe(gulp.dest(options.paths.css + name + path.sep))
               .pipe(gulpCallback(RTLize))
               .pipe(reload({stream: true}));
       });

       callback();
   });

    // Make RTL copy of main file
    function RTLize(file) {
        var name = path.basename(file.path, '.css');

        if (!~options.rtlcopy.indexOf(name + '.scss'))  return;

        gulp.src(path.join(options.paths.css + name, name + '.css'))
            .pipe($.rename(name + '-rtl.css'))
            .pipe($.cssFlipper())
            .pipe(gulp.dest(options.paths.css + name + path.sep))
            .pipe(reload({stream: true}));
    }
};

