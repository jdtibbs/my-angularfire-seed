'use strict';

// Declare app level module which depends on filters, and services
angular.module('app', [
    'my.config',
    'app.exception.decorator',
    'my.user.controller',
    'chat.module',
    'my.home.controller',
    'my.inventory.controller',
    'my.inventoryDetail.controller',
    'my.contacts.controller',
    'my.contactsDetail.controller',
    'my.login.controller',
    'my.menu.controller',
    'my.decorators',
    'my.directives',
    'my.filters',
    'ngRoute'
])
        // TODO move this into its own file.
        .directive('autoFocus', function ($timeout) {
            return {
                restrict: 'AC',
                link: function (_scope, _element) {
                    $timeout(function () {
                        _element[0].focus();
                    }, 100);
                }
            };
        });


