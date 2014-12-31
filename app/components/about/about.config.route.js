(function () {

    'use strict';

    angular.module('about.module')
            .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider.when('/about', {
            //controller: 'AboutController',
            //controllerAs: 'about',
            templateUrl: 'app/components/about/about.html'
        }
        );
    }


})();