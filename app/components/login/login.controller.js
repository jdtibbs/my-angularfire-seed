(function () {
    'use strict';

    angular.module('login.module')
            .controller('LoginController', controller);

    controller.$inject = ['loginFactory', '$location'];

    function controller(loginFactory, $location) {

        var vm = this;
        vm.profile = null;
        vm.email = null;
        vm.pass = null;
        vm.confirm = null;
        vm.createMode = false;
        vm.login = login;
        vm.register = register;

        function login(email, pass) {
            vm.err = null;
            loginFactory.login(email, pass)
                    .then(function (/* user */) {
                        $location.path('/user');
                    }, function (err) {
                        vm.err = errMessage(err);
                    });
        }

        function register() {
            vm.err = null;
            if (validate()) {
                loginFactory.register(vm.profile, vm.email, vm.pass)
                        .then(function (login) {
                            $location.path('/user');
                        })
                        .catch(function (error) {
                            vm.err = errMessage(error);
                        });
            }
        }
        function validate() {
            if (!vm.email) {
                vm.err = 'Please enter an email address';
            } else if (vm.createMode && !vm.profile.name) {
                vm.err = 'Please enter a name';
            } else if (vm.createMode && !vm.profile.businessPhone) {
                vm.err = 'Please enter a business phone';
            }
            else if (!vm.pass || !vm.confirm) {
                vm.err = 'Please enter a password';
            }
            else if (vm.createMode && vm.pass !== vm.confirm) {
                vm.err = 'Passwords do not match';
            }
            return !vm.err;
        }

        function errMessage(err) {
            return angular.isObject(err) && err.code ? err.code : err + '';
        }
    }
})();