module.exports = function (config) {
    config.set({
        basePath: '../',
        files: [
            'app/bower_components/angular/angular.js',
            'app/bower_components/angular-route/angular-route.js',
            'app/bower_components/angular-mocks/angular-mocks.js',
            'app/bower_components/mockfirebase/browser/mockfirebase.js',
            'app/bower_components/angularfire/dist/angularfire.js',
            'test/lib/**/*.js',
            'app/test-sandbox/*.js',
            'app/test-sandbox/*.spec.js',
            'app/chat/injection.spec.js',
//            'app/chat/*.js',
//            'app/chat/*.test.js'
            'app/test-sandbox/controller2.spec.js',
            'app/test-sandbox/hello/hello.module.js',
            'app/test-sandbox/hello/hello.config.js',
            'app/test-sandbox/hello/hello.service.js',
            'app/test-sandbox/hello/hello.controller.js',
            'app/test-sandbox/hello/hello.controller.spec.js'
        ],
        exclude: [
            'app/bower_components/angular-material/**/*.js',
            'app/bower_components/bootstrap/**/*.js',
            'app/bower_components/jquery/**/*.js'
        ],
        autoWatch: true,
        frameworks: ['jasmine'],
        browsers: ['Chrome'],
        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
        ],
        reporters: [
            'progress',
            'junit'
        ],
        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }

    });
};
