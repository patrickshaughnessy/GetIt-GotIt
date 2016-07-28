const gulp = require('gulp');
const args = require('yargs').argv;
const browserSync = require('browser-sync');
const config = require('./gulp.config')();
const del = require('del');

/* jshint ignore:start */
const $ = require('gulp-load-plugins')({ lazy: true }); // const throwing redefine error
/* jshint ignore:end */

const port = process.env.PORT || config.defaultPort;

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

gulp.task('vet', function() {
	log('Analyzing source with JSHint and JSCS');
	return gulp
		.src(config.alljs)
		.pipe($.if(args.verbose, $.print()))
		// .pipe($.jscs())
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish', { verbose: true }))
		.pipe($.jshint.reporter('fail'));
});

gulp.task('fonts', ['clean-fonts'], function() {
	log('Copying fonts');
	return gulp.src(config.fonts)
		.pipe(gulp.dest(config.dist + 'fonts'));
});

gulp.task('images', ['clean-images'], function() {
	log('Copying and compressing images');
	return gulp
		.src(config.images)
		.pipe($.imagemin({ optimizationLevel: 4 }))
		.pipe(gulp.dest(config.dist + 'images'));
});

gulp.task('styles', ['clean-styles'], function() {
	log('Compiling Less -> CSS');
	return gulp
		.src(config.less)
		.pipe($.plumber())
		.pipe($.less())
		.pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
		.pipe(gulp.dest(config.temp));
});

gulp.task('clean', function(done){
	const delconfig = [].concat(config.dist, config.temp);
	log('Cleaning: ', $.util.colors.blue(delconfig));
	del(delconfig, done);
});

gulp.task('clean-fonts', function(done){
	clean(config.dist + 'fonts/**/*.*', done);
});

gulp.task('clean-images', function(done){
	clean(config.dist + 'images/**/*.*', done);
});

gulp.task('clean-styles', function(done){
	clean(config.temp + '**/*.css', done);
});

gulp.task('clean-code', function(done){
	const files = [].concat(
		config.temp + '**/*.js',
		config.dist + '**/*.html',
		config.dist + 'js/**/*.js'
	);
	clean(files, done);
});

gulp.task('less-watcher', function() {
	gulp.watch([config.less], ['styles']);
});

gulp.task('templatecache', ['clean-code'], function() {
	log('Creating AngularJS $templateCache');

	return gulp
		.src(config.htmltemplates)
		.pipe($.minifyHtml({ empty: true }))
		.pipe($.angularTemplatecache(
			config.templateCache.file,
			config.templateCache.options
		))
		.pipe(gulp.dest(config.temp));
});

gulp.task('wiredep', function() {
	log('Wire up the bower css js and app js into html');

	const options = config.getWiredepDefaultOptions();
	const wiredep = require('wiredep').stream;

	return gulp
		.src(config.index)
		.pipe(wiredep(options))
		.pipe($.inject(gulp.src(config.js)))
		.pipe(gulp.dest(config.client));
});

gulp.task('inject', ['wiredep', 'styles'], function() {
	log('Wire up the app css into the html and call wiredep');

	return gulp
		.src(config.index)
		.pipe($.inject(gulp.src(config.css)))
		.pipe(gulp.dest(config.client));
});

gulp.task('serve-dev', ['inject'], function() {
	const isDev = true;

	const nodeOptions = {
		script: config.nodeServer,
		delayTime: 1,
		env: {
			'PORT': port,
			'NODE_ENV': isDev ? 'dev' : 'build'
		},
		watch: [config.server]
	};

	return $.nodemon(nodeOptions)
		.on('restart', ['vet'], function(ev){
			log('*** nodemon restarted');
			log('files changed on restart:\n' + ev);
			setTimeout(function(){
				browserSync.notify('reloading now ...');
				browserSync.reload({ stream: false });
			}, config.browserReloadDelay);
		})
		.on('start', function(){
			log('*** nodemon started');
			startBrowserSync();
		})
		.on('crash', function(){
			log('*** nodemon crashed');
		})
		.on('exit', function(){
			log('*** nodemon exited cleanly');
		});
});

//////////// HELPER FUNCTIONS ////////////

function changeEvent(event) {
	const srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
	log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

function startBrowserSync() {
	if(args.nosync || browserSync.active) {
		return;
	}

	log('Starting browser synce on port ' + port);

	gulp.watch([config.less], ['styles'])
			.on('change', function(event) { changeEvent(event); });

	const options = {
		proxy: 'localhost:' + port,
		port: 8080,
		files: [
			config.client + '**/*.*',
			'!' + config.less,
			config.temp + '**/*.css'
		],
		ghostMode: {
			clicks: true,
			location: false,
			forms: true,
			scroll: true
		},
		injectChanges: false,
		logFileChanges: true,
		logLevel: 'debug',
		logPrefix: 'gulp-patterns',
		notify: true,
		reloadDelay: 1000
	};

	browserSync(options);
}

function clean(path, done) {
	log('Cleaning: ' + $.util.colors.blue(path));
	del(path).then(paths => done());
}

function log(msg) {
	if (typeof msg === 'object') {
		for (var item in msg) {
			if (msg.hasOwnProperty(item)) {
				$.util.log($.util.colors.blue(msg[item]));
			}
		}
	} else {
		$.util.log($.util.colors.blue(msg));
	}
}
