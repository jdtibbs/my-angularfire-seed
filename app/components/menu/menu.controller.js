(function () {
    'use strict';

    angular.module('menu.module')
            .controller('MenuController', controller);

    controller.$inject = ['menuFactory', 'loginFactory', '$location'];

    function controller(menuFactory, loginFactory, $location) {

        var vm = this;
        vm.collapse = true;
        vm.toggleCollapse = toggleCollapse;
        vm.logout = logout;
        vm.items = items();

        function toggleCollapse() {
            vm.collapse = !vm.collapse;
        }

        function logout() {
            toggleCollapse();
            loginFactory.logout();
            $location.path('/home');
        }

        function items() {
            return menuFactory.menu();
        }
    }
})();

