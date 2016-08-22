"use strict";
// Include gulp
var fs = require("fs");
var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps")
var path = require("path");
var browserSync = require("browser-sync").create();
var sass = require('gulp-sass');
var babelify = require('babelify');
var gutil = require('gulp-util');

var browserify = require("browserify");
var source = require('vinyl-source-stream');
var reload = browserSync.reload;

gulp.task('watch',['browserify', 'sass'], function(){
  browserSync.init({
     server:'./src'
  });
  gulp.watch("./src/sass/**/*.scss", ['sass']);
  gulp.watch("./src/scripts/**/*.js", ['browserify']);  
  gulp.watch("./src/**/*.html").on('change', reload);  
  gulp.watch("./src/bundle*.js").on('change', reload);
});

gulp.task('sass',function(){
  return gulp.src('./src/sass/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass()).on('error', function logError(error) {
      console.error(error);
  })
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./src/css'))
  .pipe(reload({stream:true}));  
});

gulp.task('browserify', ['browserify_phone', 'browserify_moderator', 'browserify_screen']);

gulp.task('browserify_phone',function(){
  return browserify(['./src/scripts/app_phone.js'], {debug:true})
    .transform(babelify)
    .on('error', gutil.log)    
    .bundle()    
    .on('error', gutil.log)    
    .pipe(source('bundle_phone.js'))
    .pipe(gulp.dest('./src'));
});

gulp.task('browserify_moderator',function(){
  return browserify(['./src/scripts/app_moderator.js'], {debug:true})
    .transform(babelify)
    .on('error', gutil.log)    
    .bundle()    
    .on('error', gutil.log)
    .pipe(source('bundle_moderator.js'))
    .pipe(gulp.dest('./src'));
});

gulp.task('browserify_screen',function(){
  return browserify(['./src/scripts/app_screen.js'], {debug:true})
    .transform(babelify)
    .on('error', gutil.log)    
    .bundle()    
    .on('error', gutil.log)    
    .pipe(source('bundle_screen.js'))
    .pipe(gulp.dest('./src'));
});


/* Default task */
gulp.task("default", ["watch"]);