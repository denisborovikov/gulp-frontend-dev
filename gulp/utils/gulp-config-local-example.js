// Rename this file to `gulp-config-local.js`.
// Options here override `gulp-config.js`.
var options = {};

// Browser sync options (http://www.browsersync.io/docs/options/).
// browserSync.proxy    - Proxy an EXISTING vhost. Used for `gulp watch`.
options.browserSync = {
    proxy   : "local.dev:8080"
};

module.exports = options;