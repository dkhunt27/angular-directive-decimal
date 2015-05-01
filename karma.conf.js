module.exports = function (config) {
  "use strict";

  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      'bower_components/angular/angular.min.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'angular-directive-decimal.js',
      'test/angular-directive-decimal.spec.js'
    ],
    reporters: [
      'progress',
      'coverage',
      'coveralls'
    ],
    preprocessors: {
      'angular-directive-decimal.js': ['coverage']
    },
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },
    // client.args
    //    When karma run is passed additional arguments on the command-line, they are passed through to the test adapter as
    //    karma.config.args (an array of strings). The client.args option allows you to set this value for actions other than run.
    // client.useIframe
    //    Run the tests inside an iFrame or a new window
    // client.captureConsole
    //    Capture all console output and pipe it to the terminal.
    client: {
      mocha: {
        timeout: 30000
      },
      args: [],
      useIframe: false,
      captureConsole: true
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false
  });
};
