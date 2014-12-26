(function () {
    'use strict';

    angular.module('menu.module')
            .controller('MenuController', controller);

    controller.$inject = ['menuFactory', 'loginFactory', '$location'];

    function controller(menuFactory, loginFactory, $location) {

        var vm = this;
        vm.collapse = true;
        vm.collapseOn = collapseOn;
        vm.collapseOff = collapseOff;
        vm.logout = logout;
        vm.items = items();
        vm.hasItems = hasItems;

        function collapseOn() {
            vm.collapse = true;
        }

        function collapseOff() {
            vm.collapse = false;
        }

        function logout() {
            collapseOn();
            loginFactory.logout();
            $location.path('/home');
        }

        function items() {
            return menuFactory.menu();
        }

        function hasItems(items) {
            console.log(JSON.stringify(items));
            console.log((items.length === 0));
            angular.forEach(items, function (value, key) {
                console.log('value = ' + JSON.stringify(value.value) + ' ' + JSON.stringify(value.url));
                if (value.items) {
                    angular.forEach(value.items, function (value, key) {
                        console.log('\t' + 'value = ' + JSON.stringify(value.value) + ' ' + JSON.stringify(value.url));
                    });
                }
            });
            return (items.length === 0);
        }
    }
})();

