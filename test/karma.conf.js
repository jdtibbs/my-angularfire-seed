module.exports = function (config) {
    config.set({
        basePath: '../',
        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/mockfirebase/browser/mockfirebase.js',
            'bower_components/angularfire/dist/angularfire.js',
            'test/lib/**/*.js',
            'app/test-sandbox/*.js',
            'app/test-sandbox/*.spec.js',
            //'app/chat/chat.module.js',
            //'app/chat/chat.config.route.js',
            //'app/chat/chat.constants.js',
            //'app/chat/chat.controller.js',
            //'app/chat/chat.factory.js',
            //'app/chat/*.spec.js',
            'app/test-sandbox/controller2.spec.js',
            'app/test-sandbox/hello/hello.module.js',
            'app/test-sandbox/hello/hello.config.js',
            'app/test-sandbox/hello/hello.service.js',
            'app/test-sandbox/hello/hello.controller.js',
            'app/test-sandbox/hello/hello.controller.spec.js'
        ],
        exclude: [
            'bower_components/angular-material/**/*.js',
            'bower_components/bootstrap/**/*.js',
            'bower_components/jquery/**/*.js'
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
