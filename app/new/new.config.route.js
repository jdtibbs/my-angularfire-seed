(function () {

    'use strict';

    angular.module('new.module')
            .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider.when('/path', {
            controller: 'controller',
            controllerAs: 'ctrl',
            templateUrl: 'app/path/new.html',
            resolve: {
                // controller will not be loaded until this resolveFn resolves.
                resolve: resolveFn
            }
        }
        );
    }

    resolveFn.$inject = [/* 'factory' */];

    function resolveFn(/* factory */) {
        // return factory.returnPromise();
    }

})();