'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'myApp.config',
    'account.controller',
    'chat.controller',
    'home.controller',
    'login.controller',
    'menu.controller',
    'myApp.decorators',
    'myApp.directives',
    'myApp.filters',
    'myApp.routes',
    'myApp.services'
])

        .run(['loginFactory', function (loginFactory) {
                console.log('run'); //debug
                loginFactory.getUser();
            }]);
