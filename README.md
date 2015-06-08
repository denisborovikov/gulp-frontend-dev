# Gulp frontend dev tasks pack

## Prepare

### Install

Skip this step if you already did it before.

1. Clone this repo to a directory outside project root: `git clone git@github.com:denisborovikov/gulp-frontend-dev.git`.
2. Go to the cloned directory: `cd gulp-frontend-dev`.
3. Install dependencies: `npm install`.
4. Install Gulp if not installed: `npm install -g gulp`.


### Link

1. Go to the project root directory.
2. Make symlink to `gulp-frontend-dev/node_modules` directory: `ln -s /your_path_to/gulp-frontend-dev/node_modules .`
3. Make symlink to `gulp-frontend-dev/gulp` directory: `ln -s /your_path_to/gulp-frontend-dev/gulp .`
4. If you start a new project, copy `gulp-config.js`, `gulp-config-local-example.js`, `gulpfile.js` and `package.json` files from the repo (see install section) to the project root directory. If it's existing project, this files should be in place.


### Config

1. Copy `gulp-config-local-example.js` and rename it to `gulp-config-local.js`. Make all of your local specific changes in this file.
2. If you start a new project, add `node_modules`, `gulp`, and `gulp-config-local.js` to `.gitignore`.


### Update

Make this step cccasionally to make sure that your npm dependencies and gulp tasks are up-to-date.

Make this step if you get an error running gulp tasks.

1. Go to the `gulp-frontend-dev` directory.
2. Update the repo: `git pull`.
3. If `gulpfile.js` was changed, copy and replace it in your project(s) root directory(s).
4. If `package.json` was changed, copy and replace it in your project(s) root directory(s).
5. If `gulp-config.js` was changed, merge it with the same file in your project(s) root directory(s).
6. 4. If `gulp-config-local-example.js` was changed, copy it to your project(s) root directory(s), rename to `gulp-config-local.js` and merge with the same file.
7. Update npm dependencies: `npm install`.


## Gulp task

TODO: Add tasks description.


### Compile scss

`gulp`

### Optimize images

`gulp images`

### Generate png-sprites

`gulp sprites`

### Generate SVG-sprites

`gulp svg`

### Lint scss

`gulp lint`

### Watch for changes

`gulp watch`