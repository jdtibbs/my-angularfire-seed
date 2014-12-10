'use strict';
angular.module('my.user.controller', ['my.users.firebase.service', 'my.login.firebase.service', 'my.login.service', 'ngRoute'])
        .config(["$routeProvider", function ($routeProvider) {
                $routeProvider.when("/user", {
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
                    }});
            }])

        .controller('userController', ['$scope', 'usersFirebaseService', 'loginFirebaseService', 'loginService', '$location',
            function ($scope, usersFirebaseService, loginFirebaseService, loginService, $location) {

                loginService.getUid()
                        .then(function (uid) {
                            loginFirebaseService.syncObject(uid).$loaded()
                                    .then(function (login) {
                                        $scope.login = login;

                                        usersFirebaseService.syncObject(login.users).$loaded()
                                                .then(function (profile) {
                                                    $scope.profile = profile;
                                                });
                                    });
                        })
                        .catch(function (error) {
                            console.log(error);
                        });

                $scope.saveProfile = function (profile) {
                    resetMessages();
                    usersFirebaseService.save(profile)
                            .then(function (ref) {
                                $scope.profileMsg = 'Profile successfully updated.';
                            })
                            .catch(function (error) {
                                $scope.profileErr = error;
                            });
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
                        loginService.changePassword($scope.login.email, pass, newPass)
                                .then(function () {
                                    $scope.msg = 'Password changed';
                                    // clear form after successful completion.
                                    $scope.oldpass = null;
                                    $scope.confirm = null;
                                    $scope.newpass = null;
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
                        loginService.changeEmail(newEmail, pass)
                                .then(function (auth) {
                                    loginFirebaseService.syncObject(auth.uid).$loaded()
                                            .then(function (login) {
                                                $scope.login = login;

                                                usersFirebaseService.syncObject(login.users).$loaded()
                                                        .then(function (profile) {
                                                            $scope.profile = profile;
                                                        });
                                            });
                                    $scope.newEmail = null;
                                    $scope.pass = null;
                                    $scope.emailmsg = 'Email changed successfully.';
                                })
                                .catch(function (error) {
                                    console.log(error);
                                    $scope.emailerr = error;
                                });
                    }
                };
                function resetMessages() {
                    $scope.profileErr = null;
                    $scope.profileMsg = null;
                    $scope.err = null;
                    $scope.msg = null;
                    $scope.emailerr = null;
                    $scope.emailmsg = null;
                }
            }
        ]);