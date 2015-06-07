// 1. Install Ruby https://www.ruby-lang.org/
// 2. `gem install scs s-lint`
var chalk = require('chalk');
var path = require('path');

module.exports = function (gulp, options, $) {
    gulp.task('lint', function () {
        return gulp.src(options.files.scss)
            .pipe($.scssLint({
                'config'      : './gulp/utils/scss-lint.yml',
                'customReport': customReporter
            }));
    });
};

var customReporter = function (file) {
    if (!file.scsslint.success) {
        console.log(file.scsslint.issues.length + ' issues in '+ chalk.yellow((file.relative)));

        file.scsslint.issues.forEach(function (issue) {
            var linter = issue.linter ? (issue.linter + ': ') : '';
            var logMsg = chalk.magenta(issue.line) + ': ' + chalk.green(linter) + issue.reason;
            console.log(logMsg);
        });
    }
};

//var shortenPath = function(file) {
//    var newPath = [],
//        fileParse = file.split(path.sep);
//
//    for (var i = fileParse.length - 4; i < fileParse.length; i++) {
//        newPath.push(fileParse[i])
//    }
//
//    return newPath.join(path.sep);
//};