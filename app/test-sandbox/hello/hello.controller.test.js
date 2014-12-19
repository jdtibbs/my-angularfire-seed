describe('app.hello test', function () {
    'use strict';

    var $controller;
    var controller;

    beforeEach(
            module('app.hello')
            );

    beforeEach(inject(function ($injector) {
        $controller = $injector.get('$controller');
        controller = $controller('controller');
    }));

    it('controller should be defined', function () {
        expect(controller).toBeDefined();
    });

    it('test route', function () {
        // testing route:
        // http://stackoverflow.com/questions/15990102/angularjs-route-unit-testing
        // http://plnkr.co/edit/j1o0iu?p=preview
        inject(function ($route, $location, $rootScope, $httpBackend) {
            expect($route.current).toBeUndefined();

            $httpBackend.expectGET('hello/hello.html').respond(200);
            $location.path('/hello');
            $rootScope.$digest();

            expect($route.current.templateUrl).toBe('hello/hello.html');
            expect($route.current.controller).toBe('controller');
            expect($route.current.controllerAs).toBe('ctlr');
            expect($route.current.resolve.greeting).not.toBe(null);

            // TODO there are more properties in $route to be tested.
        });
    });

    it('should say Hello Jane', function () {
        expect(controller.hello('Jane')).toEqual('Hello Jane');
    });

    it('should say Hello Fred', function () {
        expect(controller.hello('Fred')).toEqual('Hello Fred');
    });
});