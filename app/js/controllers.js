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
            }])

        .controller('AccountCtrl', ['$scope', 'loginFactory', 'fbutil', 'user', '$location',
            function ($scope, loginFactory, fbutil, user, $location) {
                // create a 3-way binding with the user profile object in Firebase
                var profile = fbutil.syncObject(['users', user.uid]);
                profile.$bindTo($scope, 'profile');
                // expose logout function to scope
                $scope.logout = function () {
                    profile.$destroy();
                    loginFactory.logout();
                    $location.path('/login');
                };
                $scope.changePassword = function (pass, confirm, newPass) {
                    resetMessages();
                    if (!pass || !confirm || !newPass) {
                        $scope.err = 'Please fill in all password fields';
                    }
                    else if (newPass !== confirm) {
                        $scope.err = 'New pass and confirm do not match';
                    }
                    else {
                        loginFactory.changePassword(profile.email, pass, newPass)
                                .then(function () {
                                    $scope.msg = 'Password changed';
                                }, function (err) {
                                    $scope.err = err;
                                })
                    }
                };
                $scope.clear = resetMessages;
                $scope.changeEmail = function (pass, newEmail) {
                    resetMessages();
                    profile.$destroy();
                    loginFactory.changeEmail(pass, newEmail)
                            .then(function (user) {
                                profile = fbutil.syncObject(['users', user.uid]);
                                profile.$bindTo($scope, 'profile');
                                $scope.emailmsg = 'Email changed';
                            }, function (err) {
                                $scope.emailerr = err;
                            });
                };
                function resetMessages() {
                    $scope.err = null;
                    $scope.msg = null;
                    $scope.emailerr = null;
                    $scope.emailmsg = null;
                }
            }
        ]);