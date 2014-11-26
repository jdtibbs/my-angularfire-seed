'use strict';

angular.module('my.login.controller', ['my.firebase.factory', 'my.user.factory', 'ngRoute'])
        .config(["$routeProvider", function ($routeProvider) {
                $routeProvider.when("/login", {
                    // the rest is the same for ui-router and ngRoute...
                    controller: "loginController",
                    templateUrl: "components/login/login.html"
                });
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
                    // placing into rootscope so can use everywhere.
                    $rootScope.auth = auth;
                });
                $rootScope.$on('$destroy', function () {
                    firebaseFactory.auth().$offAuth();
                });
            }])

        .controller('loginController', ['$scope', 'userFactory', '$location', function ($scope, userFactory, $location) {
                $scope.profile = null;
                $scope.pass = null;
                $scope.confirm = null;
                $scope.createMode = false;
                $scope.login = function (email, pass) {
                    $scope.err = null;
                    userFactory.login(email, pass)
                            .then(function (/* user */) {
                                $location.path('/user');
                            }, function (err) {
                                $scope.err = errMessage(err);
                            });
                };
                $scope.createAccount = function () {
                    $scope.err = null;
                    if (assertValidAccountProps()) {
                        userFactory.createAccount($scope.profile, $scope.pass)
                                .then(function (/* user */) {
                                    $location.path('/user');
                                }, function (err) {
                                    $scope.err = errMessage(err);
                                });
                    }
                };
                function assertValidAccountProps() {
                    if (!$scope.profile.email) {
                        $scope.err = 'Please enter an email address';
                    } else if ($scope.createMode && !$scope.profile.name) {
                        $scope.err = 'Please enter a name';
                    } else if ($scope.createMode && !$scope.profile.businessPhone) {
                        $scope.err = 'Please enter a business phone';
                    }
                    else if (!$scope.pass || !$scope.confirm) {
                        $scope.err = 'Please enter a password';
                    }
                    else if ($scope.createMode && $scope.pass !== $scope.confirm) {
                        $scope.err = 'Passwords do not match';
                    }
                    return !$scope.err;
                }

                function errMessage(err) {
                    return angular.isObject(err) && err.code ? err.code : err + '';
                }
            }]);