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

        .run(["$rootScope", "$location", 'firebaseFactory', function ($rootScope, $location, firebaseFactory) {
                $rootScope.$on("$routeChangeError", function (event, next, previous, error) {
                    // We can catch the error thrown when the $requireAuth promise is rejected
                    // and redirect the user back to the home page
                    if (error === "AUTH_REQUIRED") {
                        $location.path("/login");
                    }
                });
                firebaseFactory.auth().$onAuth(function (auth) {
                    // placing into rootscope so can use everywhere.
                    $rootScope.auth = auth;
                });
                $rootScope.$on('$destroy', function () {
                    firebaseFactory.auth().$offAuth();
                });
            }]);
