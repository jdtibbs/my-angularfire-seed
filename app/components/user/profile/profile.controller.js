(function () {

    'use strict';

    angular.module('user.module')
            .controller('ProfileController', controller);

    controller.$inject = ['userDaoFactory', 'auth', 'profile'];

    function controller(userDaoFactory, auth, profile) {

        var vm = this;
        vm.auth = auth;
        vm.profile = profile;

        vm.saveProfile = saveProfile;
        vm.clear = clear;

        function saveProfile(profile) {
            clear();
            userDaoFactory.save(profile)
                    .then(function (ref) {
                        vm.message = 'Profile change complete.';
                    })
                    .catch(function (error) {
                        vm.error = error;
                    });
        }

        function clear() {
            vm.error = null;
            vm.message = null;
        }
    }
})();

