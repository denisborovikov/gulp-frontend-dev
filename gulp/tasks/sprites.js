// Task to create sprite images and SCSS files.
// Only PNG files can be used as a source.
// Directory name should start from `options.sprites.prefix` (`sprite-` by default) to be processed.
// Add @2x to the end of a directory name and put double sized images inside
// to automatically create normal and retina sprite images and SCSS for both versions.
// Generated sprite will be sored at `options.paths.img` directory.
// SCSS will be stored at the same directory as source images.
//
// If there are several sprite directories with the same name inside the same
// project, only one sprite will be generated. All images from this directories
// will be combined together. Images with the same name will be ignored besides
// the first one. So, different images in the same named sprites should have
// different names.

var fs          = require('fs');
var path        = require('path');
var sprite      = require('css-sprite').stream;
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var dirsList    = require('../utils/utils').dirsList;

module.exports = function(gulp, options, $) {
    gulp.task('sprites', function (callback) {
        var spritesByProjects = getSpritesByProjects(dirsList(options.sprites.src));

        for (var projectName in spritesByProjects) {
            for (var spriteName in spritesByProjects[projectName]) {
                var spriteDirs = spritesByProjects[projectName][spriteName];
                var filesList = getFilesForSprite(spriteDirs);

                var parsedSpriteName = parseSpriteName(spriteName);
                var prefixedName = options.sprites.prefix + parsedSpriteName.name;
                var retina = parsedSpriteName.retina;
                var currentDir = spriteDirs[0];

                gulp.src(filesList)
                    .pipe(sprite({
                              prefix       : prefixedName,
                              name         : prefixedName,
                              style        : '_' + prefixedName + '.scss',
                              cssPath      : options.sprites.url + currentDir,
                              orientation  : options.sprites.orientation,
                              margin       : options.sprites.margin,
                              template     : options.sprites.template,
                              interpolation: options.sprites.interpolation,
                              retina       : retina
                          }))
                    .pipe($.imagemin())
                    .pipe($.if('*.png', gulp.dest(options.paths.img + path.dirname(currentDir)), gulp.dest(options.sprites.src + path.dirname(currentDir))))
                    .pipe(reload({stream: true}));
            }
        }

        callback();
    });

    // Check and parse directory's name
    // Return false if it's not sprite directory
    // else return hash with name and retina.
    //
    // For `sprite-alice@2x` returns:
    // {
    //   name: 'alice',
    //   retina: true
    // }
    function parseSpriteName(name) {
        var prefixLength = options.sprites.prefix.length;
        var parsed = {
            retina: false
        };

        if (name.slice(0, prefixLength) !== options.sprites.prefix) {
            return false;
        }

        parsed.name = name.slice(prefixLength);

        if (parsed.name.slice(-3) === '@2x') {
            parsed.name = parsed.name.slice(0, -3);
            parsed.retina = true;
        }

        return parsed;
    }

    // Get directoriess list
    // Return list of sprite directories groupped by projects
    // {
    //   project:
    //     sprite-alice: [foo/sprite-alice, bar/sprite-alice]
    //     sprite-bob: [baz/sprite-bob]
    // ...
    // }
    function getSpritesByProjects(dirs) {
        var spritesByProjects = {};

        dirs.forEach(function(dir) {
            // Check if directory is sprites directory
            if (parseSpriteName(path.basename(dir)) !== false) {
                var projectName = dir.split(path.sep)[0];
                var spriteName = path.basename(dir);

                spritesByProjects[projectName] = spritesByProjects[projectName] || {};

                if (!Array.isArray(spritesByProjects[projectName][spriteName])) {
                    spritesByProjects[projectName][spriteName] = [dir];
                } else {
                    spritesByProjects[projectName][spriteName].push(dir);
                }
            }
        });

        return spritesByProjects;
    }

    // Add files from diffrent sprite directories with the same name to array.
    // Files with the same name after the 1st one are ignored.
    function getFilesForSprite(dirs) {
        var uniqueFiles = {},
            filesList = [];

        dirs.forEach(function(dir) {
            var fullPath = path.join(options.sprites.src, dir);
            var files = fs.readdirSync(fullPath);

            files.forEach(function(file) {
                if (!uniqueFiles[file]) {
                    uniqueFiles[file] = path.join(fullPath, file);
                }
            });
        });

        for (var fileName in uniqueFiles) {
            filesList.push(uniqueFiles[fileName]);
        }

        return filesList;
    }
};
