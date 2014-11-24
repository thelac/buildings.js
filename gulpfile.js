var gulp = require('gulp');
var run = require('gulp-run');
var connect = require('gulp-connect');
var path = require('path');
var stylus = require('gulp-stylus');
var nib = require('nib');
gulp.task('connect', function() {
  connect.server({
    port: 8880
  });
});

gulp.task('stylus', function() {
  gulp.src('./css/style.styl')
    .pipe(stylus({
      use: [nib()]
    }))
    .pipe(gulp.dest('./css'));
})

gulp.task('watch', function() {
  gulp.watch('./css/*.styl', ['stylus']);
});

gulp.task('default', ['connect', 'watch']);

var build_files = [
  'css/**/*.*',
  'img/**/*.*',
  'js/**/*.*',
  'index.html',
  'noWebGL.html'
];

gulp.task('build', function() {
  gulp.src(build_files, {
    base: './'
  })
    .pipe(gulp.dest('build'));
});

gulp.task('upload', function() {
  run('aws s3 sync build s3://labs.floored.com/buildings').exec();
});

gulp.task('publish', ['build', 'upload']);