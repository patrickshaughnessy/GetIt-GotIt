const gulp = require('gulp');
const args = require('yargs').argv;
const browserSync = require('browser-sync');
const config = require('./gulp.config')();
const del = require('del');
const path = require('path');
const _ = require('lodash');


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

gulp.task('inject', ['wiredep', 'styles', 'templatecache'], function() {
	log('Wire up the app css into the html and call wiredep');

	return gulp
		.src(config.index)
		.pipe($.inject(gulp.src(config.css)))
		.pipe(gulp.dest(config.client));
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

gulp.task('build', ['optimize', 'images', 'fonts'], function() {
  log('Building everything');

  const msg = {
    title: 'gulp build',
    subtitle: 'Deployed to the dist folder',
    message: 'Running `gulp serve-prod`'
  };
  del(config.temp);
  log(msg);
  notify(msg);

});

gulp.task('optimize', ['inject', 'test'], function(){
  log('Optimizing the js, css, html');

  const templateCache = config.temp + config.templateCache.file;

	const jsFilter = $.filter('**/*.js', {restore: true});
	const cssFilter = $.filter('**/*.css', {restore: true});
	const indexHtmlFilter = $.filter(['**/*', '!**/index.html'], {restore: true});

  return gulp
    .src(config.index)
    // .pipe($.plumber())
    .pipe($.inject(gulp.src(templateCache, {read: false}), {
      starttag: '<!-- inject:templates:js -->'
    }))
    .pipe($.useref({ searchPath: './' }))
		.pipe(jsFilter)
		.pipe($.ngAnnotate())
		.pipe($.uglify())
		.pipe(jsFilter.restore)
		.pipe(cssFilter)
		.pipe($.csso())
		.pipe(cssFilter.restore)
		.pipe(indexHtmlFilter)
		.pipe($.rev())
		.pipe(indexHtmlFilter.restore)
		.pipe($.revReplace())
    .pipe(gulp.dest(config.dist));
});

/**
 * Bump the versions
 * -- type=pre will bump the prerelease version *.*.*-x
 * -- type=patch or no flag will bump the patch version *.*.x
 * -- type=minor will bump the minor version *.x.*
 * -- type=major will bump the major version x.*.*
 * -- version=1.2.3 will bump to a specific version and ignore other flags
 */

gulp.task('bump', function() {
	let msg = 'Bumping versions';
	const type = args.type;
	const version = args.version;

	const options = {};

	if (version) {
		options.version = version;
		msg += ' to ' + version;
	} else {
		options.type = type;
		msg += ' for a ' + type;
	}

	log(msg);
	return gulp
		.src(config.packages)
		.pipe($.print())
		.pipe($.bump(options))
		.pipe(gulp.dest(config.root));


});

gulp.task('serve-prod', ['build'], function() {
  serve(false /* isDev */);
});

gulp.task('serve-dev', ['inject'], function() {
  serve(true /* isDev */);
});

gulp.task('test', ['vet', 'templatecache'], function(done) {
  startTests(true /* singleRun */, done);
});
gulp.task('autotest', ['vet', 'templatecache'], function(done) {
  startTests(false /* singleRun */, done);
});

gulp.task('serve-specs', ['build-specs'], function(done) {
	log('run the spec runner');
	serve(true /* isDev */, true /* specRunner */);
	done();
});

gulp.task('build-specs', ['templatecache'], function() {
	log('building the spec runner');

	const wiredep = require('wiredep').stream;
	const options = config.getWiredepDefaultOptions();
	let specs = config.specs;

	options.devDependencies = true;

	if (args.startServers) {
		specs = [].concat(specs, config.serverIntegrationSpecs);
	}

	return gulp
		.src(config.specRunner)
		.pipe(wiredep(options))
		.pipe($.inject(gulp.src(config.testlibraries, {read:false}), {name:'inject:testlibraries'}))
		.pipe($.inject(gulp.src(config.js, {read: false})))
		.pipe($.inject(gulp.src(config.specHelpers, {read: false}), {name: 'inject:spechelpers'}))
		.pipe($.inject(gulp.src(config.specs, {read: false}), {name: 'inject:specs'}))
		.pipe($.inject(gulp.src(config.temp + config.templateCache.file, {read: false}), {name: 'inject:templates'}))
		.pipe(gulp.dest(config.client));
});

// gulp 4
// gulp.task('build', gulp.series(
// 	gulp.parallel('vet', 'test'),
// 	gulp.parallel('wiredep', 'styles', 'templatecache'),
// 	'optimize'
// ))

//////////// HELPER FUNCTIONS ////////////
function serve(isDev, specRunner) {
	const nodeOptions = {
		script: config.nodeServer,
		delayTime: 1,
		env: {
			'PORT': port,
			'NODE_ENV': isDev ? 'development' : 'production'
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
			startBrowserSync(isDev, specRunner);
		})
		.on('crash', function(){
			log('*** nodemon crashed');
		})
		.on('exit', function(){
			log('*** nodemon exited cleanly');
		});
}

function changeEvent(event) {
	const srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
	log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

function notify(options) {
  const notifier = require('node-notifier');
  const notifyOptions = {
    // sound: 'Bottle',
    contentImage: path.join(__dirname, 'gulp.png'),
    icon: path.join(__dirname, 'gulp.png')
  };
  _.assign(notifyOptions, options);
  notifier.notify(notifyOptions);
}

function startBrowserSync(isDev, specRunner) {
	if(args.nosync || browserSync.active) {
		return;
	}

	log('Starting browser synce on port ' + port);

  if (isDev) {
		log('registering styles watch is dev mode');
		// $.watch([config.less], function(files, cb){
		// 	gulp.start('styles')
		// })
    gulp.watch([config.less], ['styles'])
      .on('change', function(event) { changeEvent(event); });
  } else {
		log('registering styles watch is prod mode');
    gulp.watch([config.less, config.js, config.html], ['optimize', browserSync.reload])
      .on('change', function(event) { changeEvent(event); });
  }

	const options = {
		proxy: 'localhost:' + port,
		port: 8080,
		files: isDev ? [
			config.client + '**/*.*',
			'!' + config.less,
			config.temp + '**/*.css'
		] : [],
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

	if (specRunner) {
		options.startPath = config.specRunnerFile;
	}

	browserSync(options);
}

function startTests(singleRun, done) {
	let child;
	let excludeFiles = [];
	const fork = require('child_process').fork;
	const Server = require('karma').Server;
	const serverSpecs = config.serverIntegrationSpecs;

	if (args.startServers) { // gulp test --startServers
		log('Starting servers');
		let savedEnv = process.env;
		savedEnv.NODE_ENV = 'dev';
		savedEnv.PORT = 8888;
		child = fork(config.nodeServer);
	} else {
		if (serverSpecs && serverSpecs.length) {
			excludeFiles = serverSpecs;
		}
	}

  const karmaOptions = {
    configFile: __dirname + '/karma.conf.js',
    exclude: excludeFiles,
    singleRun: !!singleRun
  };

  let server = new Server(karmaOptions, karmaCompleted);
  server.start();

  function karmaCompleted(karmaResult) {
    log('Karma completed!');
		if (child) {
			log('Shutting down the child process');
			child.kill();
		}

    if (karmaResult === 1) {
      done('karma: tests failed with code ' + karmaResult);
    } else {
      done();
    }
  }
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
