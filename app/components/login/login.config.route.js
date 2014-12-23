(function () {

    'use strict';

    angular.module('login.module')
            .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider.when('/login', {
            controller: 'LoginController',
            controllerAs: 'login',
            templateUrl: 'components/login/login.html'
        });
    }

})();