'use strict';

angular.module('my.login.controller', ['my.firebase.factory', 'my.user.factory', 'my.login.factory'])
        .controller('loginController', ['$scope', 'userFactory', 'loginFactory', '$location', function ($scope, userFactory, loginFactory, $location) {
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
                        loginFactory.createAccount($scope.profile, $scope.pass)
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