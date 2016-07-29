module.exports = function() {
  const client = './src/client/';
  const clientApp = client + 'app/';
  const report = './report/';
  const root = './';
  const server = './src/server/';
  const temp = './.tmp/';
  const wiredep = require('wiredep');
  const bowerFiles = wiredep({ devDependencies: true })['js'];

  const config = {
    /**
     * File paths
     */
    // all js to vet
    alljs: [
			'.src/app/**/*.js',
			'./*.js'
		],
    client: client,
    css: temp + 'styles.css',
    dist: './dist/',
    fonts: './bower_components/font-awesome/fonts/**/*.*',
    html: clientApp + '**/*.html',
    htmltemplates: clientApp + '**/*.html',
    images: client + 'images/**/*.*',
    index: client + 'index.html',
    js: [
      clientApp + '**/*.module.js',
      clientApp + '**/*.js',
      '!' + clientApp + '**/*.spec.js'
    ],
    less: client + '/styles/styles.less',
    report: report,
    root: root,
    server: server,
    temp: temp,

    /**
     * template cache
     */
     templateCache: {
      file: 'templates.js',
      options: {
        module: 'app.core',
        standAlone: false,
        root: 'app/'
      }
     },

    /**
     * Browser sync
     */
     browserReloadDelay: 1000,

    /**
     * Bower and NPM locations
     */
    bower: {
      json: require('./bower.json'),
      directory: 'bower_components/',
      ignorePath: '../..'
    },
    packages: [
      './package.json',
      './bower.json'
    ],

    /**
     * Karma and testing settings
     */
    serverIntegrationSpecs: [client + 'tests/server-integration/**/*.spec.js'],
    specHelpers: [client + 'test-helpers/*.js'],

    /**
     * Node settings
     */
    defaultPort: 3000,
    nodeServer: server + 'app.js'
  };

  config.getWiredepDefaultOptions = function() {
    const options = {
      bowerJson: config.bower.json,
      directory: config.bower.directory,
      ignorePath: config.bower.ignorePath
    };
    return options;
  };

  config.karma = getKarmaOptions();

  return config;

  ////////////////

  function getKarmaOptions() {
    const options = {
      files: [].concat(
        bowerFiles,
        config.specHelpers,
        client + '**/*.module.js',
        client + '**/*.js',
        temp + config.templateCache.file,
        config.serverIntegrationSpecs
      ),
      exclude: [],
      coverage: {
        dir: report + 'coverage',
        reporters: [
          {type: 'html', subdir: 'report-html'},
          {type: 'lcov', subdir: 'report-lcov'},
          {type: 'text-summary'}
        ]
      },
      preprocessors: {}
    };
    options.preprocessors[clientApp + '**/!(*.spec)*(.js)'] = ['coverage'];
    return options;
  }


};
