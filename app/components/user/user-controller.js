'use strict';

angular.module('my.user.controller', ['my.user.factory'])
        .controller('userController', ['$scope', 'userFactory', '$location',
            function ($scope, userFactory, $location) {

                // create a 3-way binding with the user profile object in Firebase
                var profile = {};
                userFactory.getUid().then(function (uid) {
                    profile = userFactory.getUserProfile(uid);
                    profile.$bindTo($scope, 'profile');
                }).catch(function (error) {
                    // $location.path('/login');
                });

                // expose logout function to scope
                $scope.logout = function () {
                    profile.$destroy();
                    userFactory.logout();
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
                        userFactory.changePassword(profile.email, pass, newPass)
                                .then(function () {
                                    $scope.msg = 'Password changed';
                                    // clear form after successful completion.
                                    $scope.pass = null;
                                    $scope.confirm = null;
                                    $scope.newPass = null;
                                }, function (err) {
                                    $scope.err = err;
                                });
                    }
                };
                $scope.clear = resetMessages;
                $scope.changeEmail = function (pass, newEmail) {
                    resetMessages();
                    if (!newEmail) {
                        $scope.emailerr = 'Please enter new email.';
                    } else if (!pass) {
                        $scope.emailerr = 'Please enter password.';
                    } else {
                        profile.$destroy();
                        userFactory.changeEmail(pass, newEmail)
                                .then(function (user) {
                                    profile = userFactory.getUserProfile(user.uid);
                                    profile.$bindTo($scope, 'profile');
                                    $scope.emailmsg = 'Email changed';
                                    // clear form after successful completion.
                                    $scope.pass = null;
                                    $scope.newEmail = null;
                                }, function (err) {
                                    $scope.emailerr = err;
                                });
                    }
                };
                function resetMessages() {
                    $scope.err = null;
                    $scope.msg = null;
                    $scope.emailerr = null;
                    $scope.emailmsg = null;
                }
            }
        ]);