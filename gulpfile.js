'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var del = require('del');
var rename = require('gulp-rename');

// Gulp plumber error handler
var onError = function(err) {
	console.log(err);
}

gulp.task('clean', function(){
	return del(['build/**/*']);
})

gulp.task('build', function(){
	return gulp.src(['./public/**/*'])
		.pipe(plumber())
		.pipe(gulp.dest('./build'));
})

gulp.task('addIndex', function(){
	return gulp.src(['./views/index.ejs'])
		.pipe(plumber())
		.pipe(rename('index.html'))
		.pipe(gulp.dest('./build'));
})

gulp.task('default', ['clean', 'build', 'addIndex']);
