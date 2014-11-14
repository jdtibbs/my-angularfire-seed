'use strict';

angular.module('my.login.controller', ['my.firebase.factory', 'my.login.factory'])
        .controller('loginController', ['$scope', 'loginFactory', '$location', function ($scope, loginFactory, $location) {
                $scope.email = null;
                $scope.pass = null;
                $scope.confirm = null;
                $scope.createMode = false;
                $scope.login = function (email, pass) {
                    $scope.err = null;
                    loginFactory.login(email, pass)
                            .then(function (/* user */) {
                                $location.path('/account');
                            }, function (err) {
                                $scope.err = errMessage(err);
                            });
                };
                $scope.createAccount = function () {
                    $scope.err = null;
                    if (assertValidAccountProps()) {
                        loginFactory.createAccount($scope.email, $scope.pass)
                                .then(function (/* user */) {
                                    $location.path('/account');
                                }, function (err) {
                                    $scope.err = errMessage(err);
                                });
                    }
                };
                function assertValidAccountProps() {
                    if (!$scope.email) {
                        $scope.err = 'Please enter an email address';
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