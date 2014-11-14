'use strict';

angular.module('my.user.controller', ['my.firebase.factory', 'my.login.factory'])
        .controller('userController', ['$scope', 'loginFactory', 'firebaseFactory', 'user', '$location',
            function ($scope, loginFactory, firebaseFactory, user, $location) {
                // create a 3-way binding with the user profile object in Firebase
                var profile = firebaseFactory.syncObject(['users', user.uid]);
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
                                });
                    }
                };
                $scope.clear = resetMessages;
                $scope.changeEmail = function (pass, newEmail) {
                    resetMessages();
                    profile.$destroy();
                    loginFactory.changeEmail(pass, newEmail)
                            .then(function (user) {
                                profile = firebaseFactory.syncObject(['users', user.uid]);
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