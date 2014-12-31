(function () {
    'use strict';

    angular.module('app.hello')
            .config(Config);

    Config.$inject = ['$routeProvider'];

    function Config($routeProvider) {
        $routeProvider.when('/hello', {
            controller: 'controller',
            controllerAs: 'ctlr',
            templateUrl: 'app/hello/hello.html',
            resolve: {
                greeting: Greeting
            }
        });
    }

    Greeting.$inject = ['service'];

    function Greeting(service) {
        return service.greeting();
    }
})();