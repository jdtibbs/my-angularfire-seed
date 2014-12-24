(function () {

    'use strict';

    angular.module('user.module')
            .controller('PasswordController', controller);

    controller.$inject = ['firebaseAuthFactory', 'auth', 'profile'];

    function controller(firebaseAuthFactory, auth, profile) {

        var vm = this;
        vm.auth = auth;
        vm.profile = profile;

        vm.changePassword = changePassword;
        vm.clear = clear;

        function changePassword(pass, confirm, newPass) {
            clear();
            if (!pass || !confirm || !newPass) {
                vm.error = 'Please fill in all password fields';
            }
            else if (newPass !== confirm) {
                vm.error = 'New pass and confirm do not match';
            }
            else {
                firebaseAuthFactory.changePassword(vm.auth.password.email, pass, newPass)
                        .then(function () {
                            vm.message = 'Password change complete.';
                            // clear form after successful completion.
                            vm.oldpass = null;
                            vm.confirm = null;
                            vm.newpass = null;
                        }, function (err) {
                            vm.error = err;
                        });
            }
        }

        function clear() {
            vm.error = null;
            vm.message = null;
        }
    }
})();

