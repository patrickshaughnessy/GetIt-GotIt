// 'use strict';
//
// var gulp = require('gulp');
// var del = require('del');
// var rename = require('gulp-rename');
//
// gulp.task('clean', function(cb){
// 	del(['build/**/*']).then(paths => cb())
// });
//
// gulp.task('build', ['clean'], function(cb){
// 	gulp.src(['./public/**/*'])
// 		.pipe(gulp.dest('./build'));
// });
//
// gulp.task('addIndex', ['clean'], function(cb){
// 	gulp.src(['./views/index.ejs'])
// 		.pipe(rename('index.html'))
// 		.pipe(gulp.dest('./build'));
// });
//
// gulp.task('default', ['clean', 'build', 'addIndex']);

'use strict';

var del = require('del');
var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var rename = require('gulp-rename');
var gulpUtil = require('gulp-util');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('clean', function(cb){
	del(['build/**/*']).then(paths => cb())
});

gulp.task('js', ['clean'], function(cb){
	gulp.src(['public/main.js', 'public/js/**/*.js'])
		.pipe(sourcemaps.init())
		.pipe(concat('app.min.js'))
		.pipe(ngAnnotate())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('build'));
		cb()
})

gulp.task('assets', ['clean'], function(cb){
	gulp.src('public/assets/**/*')
		.pipe(gulp.dest('build/assets'));
		cb();
})

gulp.task('bower', ['clean'], function(cb){
	gulp.src('public/bower_components/**/*')
		.pipe(gulp.dest('build/bower_components'));
		cb();
})

gulp.task('css', ['clean'], function(cb){
	gulp.src('public/css/**/*')
		.pipe(gulp.dest('build/css'));
		cb();
})

gulp.task('partials', ['clean'], function(cb){
	gulp.src('public/partials/**/*')
		.pipe(gulp.dest('build/partials'));
		cb();
})

gulp.task('statics', ['assets', 'bower', 'css', 'partials']);

gulp.task('index', ['clean'], function(cb){
	gulp.src('./views/index.ejs')
		.pipe(rename('index.html'))
		.pipe(gulp.dest('build'));
		cb();
})

gulp.task('watch', ['statics', 'js', 'index'], function(){
	gulp.watch('public/**/*', ['default']);
	gulp.watch('.views/index.ejs', ['default']);
});

gulp.task('default', ['clean', 'js', 'statics', 'watch'])
