'use strict';

var gulp = require('gulp');
var del = require('del');
var rename = require('gulp-rename');

gulp.task('clean', function(cb){
	del(['build/**/*']).then(paths => cb())
});

gulp.task('build', ['clean'], function(cb){
	gulp.src(['./public/**/*'])
		.pipe(gulp.dest('./build'));
});

gulp.task('addIndex', ['clean'], function(cb){
	gulp.src(['./views/index.ejs'])
		.pipe(rename('index.html'))
		.pipe(gulp.dest('./build'));
});

gulp.task('default', ['clean', 'build', 'addIndex']);
