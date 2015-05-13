var bower = require('bower');
var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var rm = require('gulp-rm');
var sh = require('shelljs');


var paths = {
  sass:   ['./scss/**/*.scss'],
  css:    './www/css/',
  ngJs:  ['./angular/**/*.js'],
  js:     './www/js/'
};

gulp.task('default', ['sass', 'js']);
gulp.task('build-assets', ['minify-css', 'minify-js']);

gulp.task('sass', function(done) {
  gulp.src(['./scss/app.scss', './scss/ionic.app.scss'])
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest(paths.css))
    .on('end', done);
});

gulp.task('minify-css', ['sass'], function(done) {
  gulp.src(['./www/css/*.css', '!./www/css/*.min.css'])
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    // Uncomment to keep separate .min.css files
    //.pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(paths.css))
    .on('end', done)
});

gulp.task('js', function(done) {
  // delete sourcemaps to keep clean
  gulp.src('./www/js/*.js.map', { read: false })
    .pipe(rm());
  gulp.src(paths.ngJs)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(paths.js))
    .on('end', done)
});

gulp.task('minify-js', ['js'], function(done) {
  gulp.src(['./www/js/*.js', '!./www/js/*.min.js'])
    .pipe(sourcemaps.init())
      .pipe(uglify())
      // Uncomment to keep separate .min.js files
      //.pipe(rename({ extname: '.min.js' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.js))
    .on('end', done)
});

gulp.task('watch', ['sass', 'js'], function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.ngJs, ['js']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
