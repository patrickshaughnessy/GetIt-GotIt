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
var flatten = require('gulp-flatten');

gulp.task('clean', function(cb){
	del(['build/**/*']).then(paths => cb())
});

gulp.task('jsprod', ['clean'], function(cb){
	gulp.src(['public/main.js', 'public/components/**/*.js', 'public/js/**/*.js'])
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

gulp.task('jsdev', ['clean'], function(cb){
	gulp.src(['public/main.js', 'public/components/**/*.js', 'public/js/**/*.js'])
		.pipe(concat('app.min.js'))
		.pipe(gulp.dest('build'));
		cb()
})

gulp.task('assets', ['clean'], function(cb){
	gulp.src('public/assets/**/*')
		.pipe(gulp.dest('build/assets'));
		cb();
})

gulp.task('bower', ['clean'], function(cb){
	gulp.src(['public/bower_components/**/*', '!public/bower_components/bootstrap/node_modules/**/*'])
		.pipe(gulp.dest('build/bower_components'));
		cb();
})

gulp.task('css', ['clean'], function(cb){
	gulp.src('public/css/**/*')
		.pipe(gulp.dest('build/css'));
		cb();
})

gulp.task('partials', ['clean'], function(cb){
	gulp.src(['public/partials/**/*', 'public/components/**/*.html'])
		.pipe(flatten())
		.pipe(gulp.dest('build/partials'));
		cb();
})

gulp.task('index', ['clean'], function(cb){
	gulp.src('views/index.ejs')
		.pipe(rename('index.html'))
		.pipe(gulp.dest('build'));
		cb();
})

gulp.task('statics', ['assets', 'bower', 'css', 'partials', 'index']);

gulp.task('watch', ['clean', 'jsdev', 'statics'], function(){
	gulp.watch(['public/**/*', '!public/bower_components/**/*'], ['default']);
	gulp.watch('views/index.ejs', ['default']);
});

gulp.task('development', ['clean', 'jsdev', 'statics', 'watch']);
gulp.task('production', ['clean', 'jsprod', 'statics']);

gulp.task('default', [process.env.NODE_ENV === 'production' ? 'production' : 'development']);
