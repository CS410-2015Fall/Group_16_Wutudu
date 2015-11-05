// Karma configuration
// Generated on Wed Nov 04 2015 18:31:19 GMT-0800 (PST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      // 'www/lib/angular/angular.js',
      'www/lib/ionic/js/ionic.bundle.js',
      'www/js/app.js',
      'www/js/controllers.js',
      'www/js/services.js',
      'www/js/friend/friend.controller.js',
      'www/js/friend/list.controller.js',
      'www/js/friend/friend.services.js',
      'www/js/group/list.controller.js',
      'www/js/group/group.controller.js',
      'www/js/group/group.services.js',
      'www/js/wutudu/create.controller.js',
      'www/js/wutudu/details.controller.js',
      'www/js/wutudu/question.controller.js',
      'www/js/wutudu/wutudu.services.js',
      'www/js/user/login.controller.js',
      'www/js/user/signup.controller.js',
      'www/js/user/user.services.js',
      'www/lib/ionic-datepicker/dist/ionic-datepicker.bundle.min.js',
      'www/lib/ngCordova/dist/ng-cordova.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'www/js/**/*.mocha.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // browsers: ['Chrome'],
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,//false,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  });
};
