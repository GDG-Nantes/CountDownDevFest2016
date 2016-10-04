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
var replace = require('gulp-replace');

var browserify = require("browserify");
var source = require('vinyl-source-stream');
var reload = browserSync.reload;

var runSequence = require('run-sequence');


var extensions = ['.js','.json','.es6'];

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

gulp.task('browserify', ['browserify_phone', 'browserify_moderator', 'browserify_screen', 'browserify_summary']);

gulp.task('browserify_phone',function(){
  return browserify({entries: './src/scripts/app_phone.js', debug:true, extensions: extensions})
    .transform(babelify)
    .on('error', gutil.log)    
    .bundle()    
    .on('error', gutil.log)    
    .pipe(source('bundle_phone.js'))
    .pipe(gulp.dest('./src'));
});

gulp.task('browserify_moderator',function(){
  return browserify({entries: './src/scripts/app_moderator.js', debug:true, extensions: extensions})
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


gulp.task('browserify_summary',function(){
  return browserify(['./src/scripts/app_summary.js'], {debug:true})
    .transform(babelify)
    .on('error', gutil.log)    
    .bundle()    
    .on('error', gutil.log)    
    .pipe(source('bundle_summary.js'))
    .pipe(gulp.dest('./src'));
});


gulp.task("copy", function () {
   return gulp.src([
        "src/*.html",
        "src/*.js",
        "src/*.json", 
        "src/css/**", 
        "src/assets/**", 
        ],{"base":"./src"})
    .pipe(gulp.dest('./public/'));
});

gulp.task("replace", function(){
  gulp.src(['./public/bundle_phone.js', './public/bundle_moderator.js'])
  .pipe(replace('/* SERVICE_WORKER_REPLACE', ''))
  .pipe(replace('SERVICE_WORKER_REPLACE */', ''))
  .pipe(gulp.dest('./public/'));
});

gulp.task("replace_timestamp", function(){
  gulp.src(['./public/service-worker-phone.js', './public/service-worker-moderator.js'])
  .pipe(replace('{timestamp}', Date.now()))
  .pipe(gulp.dest('./public/'));
})


gulp.task('build',function(){
  runSequence(
    ['browserify', 'sass'],
    'copy',
    'replace',
    'replace_timestamp'
  );  
});

/* Default task */
gulp.task("default", ["watch"]);
