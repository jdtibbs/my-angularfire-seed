(function () {

    'use strict';
    angular.module('menu.module')
            .factory('menuFactory', factory);

    factory.$inject = ['firebaseFactory', 'MENU_URL'];

    function factory(firebaseFactory, MENU_URL) {
        var factory = {
            menu: menu
        };
        return factory;

        function menu() {
            return firebaseFactory.syncArray(MENU_URL);
        }
    }
})();