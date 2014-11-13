'use strict';
/* Controllers */

angular.module('myApp.controllers', ['firebase.utils', 'loginModule'])
        .controller('HomeCtrl', ['$scope', 'fbutil', 'user', 'FBURL', function ($scope, fbutil, user, FBURL) {
                $scope.syncedValue = fbutil.syncObject('syncedValue');
                $scope.user = user;
                $scope.FBURL = FBURL;
            }])

        .controller('menuCtrl', ['$scope', function ($scope) {
                $scope.menu = {
                    "items": [{
                            "value": "Chat",
                            "url": "#/chat"
                        }, {
                            "value": "Login",
                            "url": "#/login"
                        }, {
                            "value": "Account",
                            "url": "#/account"
                        }],
                    "home": "#/home",
                    "selected": "x"
                };
            }])

        .controller('ChatCtrl', ['$scope', 'messageList', function ($scope, messageList) {
                $scope.messages = messageList;
                $scope.addMessage = function (newMessage) {
                    if (newMessage) {
                        $scope.messages.$add({text: newMessage});
                    }
                };
            }])

        .controller('LoginCtrl', ['$scope', 'loginFactory', '$location', function ($scope, loginFactory, $location) {
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