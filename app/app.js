'use strict';

// Declare app level module which depends on filters, and services
angular.module('my.app', [
    'my.config',
    'my.user.controller',
    'my.chat.controller',
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

        .directive('autoFocus', function ($timeout) {
            return {
                restrict: 'AC',
                link: function (_scope, _element) {
                    $timeout(function () {
                        _element[0].focus();
                    }, 0);
                }
            };
        });


