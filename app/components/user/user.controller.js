(function () {
    'use strict';

    angular.module('user.module')
            .controller('userController', userController);

    userController.$inject = ['userDaoFactory', 'loginFirebaseFactory', 'loginFactory', 'changeEmailFactory'];

    function userController(userDaoFactory, loginFirebaseFactory, loginFactory, changeEmailFactory) {

        var vm = this;
        // vm.profile = profile;
        vm.saveProfile = saveProfile;
        vm.changePassword = changePassword;
        vm.changeEmail = changeEmail;
        vm.clear = resetMessages;

        loginFactory.getUid()
                .then(function (uid) {
                    loginFirebaseFactory.syncObject(uid).$loaded()
                            .then(function (login) {
                                vm.login = login;
                                userDaoFactory.syncObject(login.users).$loaded()
                                        .then(function (profile) {
                                            vm.profile = profile;
                                        });
                            });
                })
                .catch(function (error) {
                    console.log(error);
                });

        function saveProfile(profile) {
            resetMessages();
            userDaoFactory.save(profile)
                    .then(function (ref) {
                        vm.profileMsg = 'Profile successfully updated.';
                    })
                    .catch(function (error) {
                        vm.profileErr = error;
                    });
        }

        function changePassword(pass, confirm, newPass) {
            resetMessages();
            if (!pass || !confirm || !newPass) {
                vm.err = 'Please fill in all password fields';
            }
            else if (newPass !== confirm) {
                vm.err = 'New pass and confirm do not match';
            }
            else {
                loginFactory.changePassword(vm.login.email, pass, newPass)
                        .then(function () {
                            vm.msg = 'Password changed';
                            // clear form after successful completion.
                            vm.oldpass = null;
                            vm.confirm = null;
                            vm.newpass = null;
                        }, function (err) {
                            vm.err = err;
                        });
            }
        }

        function changeEmail(pass, newEmail) {
            resetMessages();
            if (!newEmail) {
                vm.emailerr = 'Please enter new email.';
            } else if (!pass) {
                vm.emailerr = 'Please enter password.';
            } else {
                changeEmailFactory.changeEmail(newEmail, pass)
                        .then(function (auth) {
                            loginFirebaseFactory.syncObject(auth.uid).$loaded()
                                    .then(function (login) {
                                        vm.login = login;

                                        userDaoFactory.syncObject(login.users).$loaded()
                                                .then(function (profile) {
                                                    vm.profile = profile;
                                                });
                                    });
                            vm.newEmail = null;
                            vm.pass = null;
                            vm.emailmsg = 'Email changed successfully.';
                        })
                        .catch(function (error) {
                            console.log(error);
                            vm.emailerr = error;
                        });
            }
        }

        function resetMessages() {
            vm.profileErr = null;
            vm.profileMsg = null;
            vm.err = null;
            vm.msg = null;
            vm.emailerr = null;
            vm.emailmsg = null;
        }
    }
})();

