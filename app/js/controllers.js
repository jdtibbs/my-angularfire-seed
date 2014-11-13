'use strict';
/* Controllers */

angular.module('myApp.controllers', ['firebase.utils', 'simpleLogin'])
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
                $scope.menu.select = function (item) {
                    // console.log("selected menu item: " + item);
                    $scope.menu.selected = item;
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

        .controller('LoginCtrl', ['$scope', 'simpleLogin', '$location', function ($scope, simpleLogin, $location) {
                $scope.confirmEmail = null;
                $scope.password = null;
                $scope.confirmPassword = null;
                $scope.createMode = false;
                $scope.login = function (user) {
                    $scope.err = null;
                    simpleLogin.login(user.email, $scope.password)
                            .then(function (/* user */) {
                                $location.path('/account');
                            }, function (err) {
                                $scope.err = errMessage(err);
                            });
                };
                $scope.createAccount = function (user) {
                    $scope.err = null;
                    if (assertValidAccountProps(user)) {
                        simpleLogin.createAccount(user, $scope.password)
                                .then(function (/* user */) {
                                    $location.path('/account');
                                }, function (err) {
                                    $scope.err = errMessage(err);
                                });
                    }
                };
                function assertValidAccountProps(user) {
                    if (!user.name) {
                        $scope.err = 'Please enter a name.';
                    }
                    else if (!user.businessName) {
                        $scope.err = 'Please enter a business name.';
                    }
                    else if (!user.address) {
                        $scope.err = 'Please enter an address.';
                    }
                    else if (!user.city) {
                        $scope.err = 'Please enter a city.';
                    }
                    else if (!user.state) {
                        $scope.err = 'Please enter a state.';
                    }
                    else if (!user.zip) {
                        $scope.err = 'Please enter a zip.';
                    }
                    else if (!user.email) {
                        $scope.err = 'Please enter an email address';
                    }
                    else if (!user.businessPhone) {
                        $scope.err = 'Please enter a business phone.';
                    }
                    else if (!user.mobilePhone) {
                        $scope.err = 'Please enter a mobile phone.';
                    }
                    else
                    if (!user.email) {
                        $scope.err = 'Please enter an email address';
                    }
                    else if (!$scope.confirmEmail || (user.email !== $scope.confirmEmail)) {
                        $scope.err = 'Email and confirm email address do not match.';
                    }
                    else if (!$scope.password || !$scope.confirmPassword) {
                        $scope.err = 'Please enter a password';
                    }
                    else if ($scope.createMode && $scope.password !== $scope.confirmPassword) {
                        $scope.err = 'Passwords do not match';
                    }
                    return !$scope.err;
                }

                function errMessage(err) {
                    return angular.isObject(err) && err.code ? err.code : err + '';
                }
            }])

        .controller('AccountCtrl', ['$scope', 'simpleLogin', 'fbutil', 'user', '$location',
            function ($scope, simpleLogin, fbutil, user, $location) {
                // create a 3-way binding with the user profile object in Firebase
                var profile = fbutil.syncObject(['users', user.uid]);
                profile.$bindTo($scope, 'profile');
                // expose logout function to scope
                $scope.logout = function () {
                    profile.$destroy();
                    simpleLogin.logout();
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
                        simpleLogin.changePassword(profile.email, pass, newPass)
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
                    var account = $copy(profile);
                    profile.$destroy();
                    simpleLogin.changeEmail(account, pass, newEmail)
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