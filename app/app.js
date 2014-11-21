'use strict';

// Declare app level module which depends on filters, and services
angular.module('my.app', [
    'my.config',
    'my.user.controller',
    'my.chat.controller',
    'my.home.controller',
    'my.login.controller',
    'my.menu.controller',
    'my.decorators',
    'my.directives',
    'my.filters',
    'ngRoute'
])

        .config(["$routeProvider", function ($routeProvider) {
                $routeProvider.when("/home", {
                    // the rest is the same for ui-router and ngRoute...
                    controller: "homeController",
                    templateUrl: "home/home.html",
                    resolve: {
                        // controller will not be loaded until $waitForAuth resolves
                        // Auth refers to our $firebaseAuth wrapper in the example above
                        "currentAuth": ['firebaseFactory', function (firebaseFactory) {
                                // $waitForAuth returns a promise so the resolve waits for it to complete
                                return firebaseFactory.auth().$waitForAuth();
                            }]
                    }
                }).when("/login", {
                    // the rest is the same for ui-router and ngRoute...
                    controller: "loginController",
                    templateUrl: "components/login/login.html"
                }).when("/chat", {
                    // the rest is the same for ui-router and ngRoute...
                    controller: "chatController",
                    templateUrl: "chat/chat.html"
                }).when("/user", {
                    // the rest is the same for ui-router and ngRoute...
                    controller: "userController",
                    templateUrl: "components/user/user.html",
                    resolve: {
                        // controller will not be loaded until $requireAuth resolves
                        // Auth refers to our $firebaseAuth wrapper in the example above
                        "currentAuth": ['firebaseFactory', function (firebaseFactory) {
                                // $requireAuth returns a promise so the resolve waits for it to complete
                                // If the promise is rejected, it will throw a $stateChangeError (see above)
                                return firebaseFactory.auth().$requireAuth();
                            }]
                    }
                }).otherwise({
                    redirectTo: '/home'});
            }])

        .run(["$rootScope", "$location", 'firebaseFactory', function ($rootScope, $location, firebaseFactory) {
                $rootScope.$on("$routeChangeError", function (event, next, previous, error) {
                    // We can catch the error thrown when the $requireAuth promise is rejected
                    // and redirect the user back to the home page
                    if (error === "AUTH_REQUIRED") {
                        $location.path("/login");
                    }
                });
                firebaseFactory.auth().$onAuth(function (auth) {
                    $rootScope.auth = auth;
                });
                $rootScope.$on('$destroy', function () {
                    firebaseFactory.auth().$offAuth();
                });
            }]);
