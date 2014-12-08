'use strict';

angular.module('my.user.controller', ['my.user.factory', 'my.login.service', 'ngRoute'])
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
                    loginService.logout();
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