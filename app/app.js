'use strict';

// Declare app level module which depends on filters, and services
angular.module('my.app', [
    'my.config',
    'my.user.factory',
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
                        "currentAuth": ['userFactory', function (userFactory) {
                                // $waitForAuth returns a promise so the resolve waits for it to complete
                                return userFactory.firebaseAuth().$waitForAuth();
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
                        "currentAuth": ['userFactory', function (userFactory) {
                                // $requireAuth returns a promise so the resolve waits for it to complete
                                // If the promise is rejected, it will throw a $stateChangeError (see above)
                                return userFactory.firebaseAuth().$requireAuth();
                            }]
                    }
                }).otherwise({
                    redirectTo: '/home'});
            }])

        .run(["$rootScope", "$location", 'userFactory', function ($rootScope, $location, userFactory) {
                $rootScope.$on("$routeChangeError", function (event, next, previous, error) {
                    // We can catch the error thrown when the $requireAuth promise is rejected
                    // and redirect the user back to the home page
                    if (error === "AUTH_REQUIRED") {
                        $location.path("/home");
                    }
                });
                userFactory.firebaseAuth().$onAuth(function (auth) {
                    $rootScope.auth = auth;
                });
                $rootScope.$on('$destroy', function () {
                    userFactory.getAuth().$offAuth();
                });
            }]);
