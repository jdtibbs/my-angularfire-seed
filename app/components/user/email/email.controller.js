(function () {

    'use strict';

    angular.module('user.module')
            .controller('EmailController', controller);

    controller.$inject = ['userDaoFactory', 'loginDaoFactory', 'loginEmailFactory', 'auth', 'profile'];

    function controller(userDaoFactory, loginDaoFactory, loginEmailFactory, auth, profile) {

        var vm = this;
        vm.auth = auth;
        vm.profile = profile;

        vm.changeEmail = changeEmail;
        vm.clear = clear;

        function changeEmail(pass, newEmail) {
            clear();
            if (!newEmail) {
                vm.error = 'Please enter new email.';
            } else if (!pass) {
                vm.error = 'Please enter password.';
            } else {
                loginEmailFactory.changeEmail(newEmail, pass)
                        .then(function (auth) {
                            vm.auth = auth;
                            loginDaoFactory.syncObject(auth.uid).$loaded()
                                    .then(function (login) {
                                        userDaoFactory.syncObject(login.users).$loaded()
                                                .then(function (profile) {
                                                    vm.profile = profile;
                                                })
                                                .catch(function (error) {
                                                    vm.error = error;
                                                });
                                    })
                                    .catch(function (error) {
                                        vm.error = error;
                                    });
                            vm.newEmail = null;
                            vm.pass = null;
                            vm.message = 'Email change is complete.';
                        })
                        .catch(function (error) {
                            vm.error = error;
                        });
            }
        }

        function clear() {
            vm.error = null;
            vm.message = null;
        }
    }
})();

