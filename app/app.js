'use strict';

// Declare app level module which depends on filters, and services
angular.module('my.app', [
    'my.config',
    'my.account.controller',
    'my.chat.controller',
    'my.home.controller',
    'my.login.controller',
    'my.menu.controller',
    'my.decorators',
    'my.directives',
    'my.filters',
    'my.routes'
])

        .run(['loginFactory', function (loginFactory) {
                console.log('run'); //debug
                loginFactory.getUser();
            }]);
