(function () {
    angular.module('app.spat', []);
})();

(function () {
    angular.module('app.spat')
            .factory('service', Service);

    function Service() {
        var factory = {
            hello: function () {
                return 'Hello Sam';
            }
        };
        return factory;
    }
})();

(function () {
    angular.module('app.spat')
            .controller('controller', Controller);

    Controller.$inject = ['service'];

    function Controller(service) {
        var vm = this;
        vm.hello = hello;
        function hello() {
            return service.hello();
        }
    }
})();

describe('app.spat test', function () {
    'use strict';

    var controller;

    beforeEach(
            module('app.spat')
            );

    beforeEach(inject(function ($injector) {
        var $controller = $injector.get('$controller');
        controller = $controller('controller');
    }));

    it('controller should be defined', function () {
        expect(controller).toBeDefined();
    });

    it('should say Hello Sam', function () {
        expect(controller.hello()).toEqual('Hello Sam');
    });

});