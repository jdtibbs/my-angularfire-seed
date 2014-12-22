(function () {
    'use strict';

    angular.module('new.module')
            .controller('newController', controller);

    controller.$inject = [/* 'someFactory' */];

    function controller(/* someFactory */) {

        // properties and functions on vm will be avaialble
        // to the view by referencing controllerAs: 'ctrl'
        // ... ctrl.someVar ... ctlr.someFn()
        var vm = this;
        vm.someVar = someVar;
        vm.someFn = someFn;

        var someVar = 'bla';

        function someFn() {
            // return someFactory.doSomething();
        }
    }
})();

