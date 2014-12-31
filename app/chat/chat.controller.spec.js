// describe = spec suite, contain one or more 'it' (spec/test).
describe('chat.controller', function () {
    'use strict';

    // variables follow Javascript scoping rules, 
    // so variables declared within describe are available within 
    // the contained 'it'.
    var controller;

    // beforeEach is called once before each 'it' within the 'describe'.
    beforeEach(function () {
        // angular.module: https://docs.angularjs.org/api/ng/function/angular.module
        // create, register, retreive angular modules.
        // module('name', [requires(optional-if specd then new module is created else retreived)], [configFn(optional)])
        // usage here is: module('name', configFn)
        module('chat.module', function ($provide) {
            // $provide: https://docs.angularjs.org/api/auto/service/$provide
            // The $provide service has a number of methods for registering 
            // components with the $injector. Many of these functions are also exposed on angular.Module.
            $provide.value('messages', chatFactoryStub().messages);
            $provide.value('chatFactory', chatFactoryStub());
        });
    });
/*
    beforeEach(
            module('chat.module')
            );

    beforeEach(inject(function ($provide) {
        $provide.value('messages', chatFactoryStub().messages);
        $provide.value('chatFactory', chatFactoryStub());
    }));
*/
    function chatFactoryStub() {
        var obj = jasmine.createSpyObj('chatFactory', ['add', 'messages']);
        obj.add.andCallFake(function () {
            return {};
        });
        obj.messages.andCallFake(function () {
            return {};
        });
        return obj;
    }

    var $scope;
    var $controller;
    var chatFactory;
    var messages;

    beforeEach(inject(function ($injector) {
        $scope = $injector.get('$scope');
        // The $controller service is used to create instances of controllers
        $controller = $injector.get('$controller');
        chatFactory = $injector.get('chatFactory');
        messages = $injector.get('messages');
    }));

    describe('chatControler suite', function () {

        beforeEach(function () {
//            controller = $controller('ChatController', {ChatFactory: ChatFactory, message: messages});
            controller = $controller('ChatController', {$scope: $scope});
        });

        // it = spec (a test).
        it('controller is created', function () {
            // expect(actual).matcherFunction(expected)
            expect(controller).toBeDefined();
        });

        it('test route', function () {
            // testing route:
            // http://stackoverflow.com/questions/15990102/angularjs-route-unit-testing
            // http://plnkr.co/edit/j1o0iu?p=preview
            // http://stackoverflow.com/questions/15322155/how-can-i-test-a-controller-with-resolve-properties-in-angularjs?rq=1
            inject(function ($route, $location, $rootScope, $httpBackend) {
                expect($route.current).toBeUndefined();

                $httpBackend.expectGET('app/chat/chat.html').respond(200);
                $location.path('/chat');
                $rootScope.$digest();

                expect($route.current.templateUrl).toBe('app/chat/chat.html');
                expect($route.current.controller).toBe('ChatController');
                expect($route.current.controllerAs).toBe('chat');
                expect($route.current.resolve.messages).not.toBe(null);

                // TODO there are more properties in $route to be tested.
            });
        });

        it('add a message', function () {
            inject(function (chatFactory, $scope) {
//                controller.messages = ChatFactory;
                var controller = $scope;
                controller.addMessage('fred');
                expect(chatFactory.add).toHaveBeenCalled();
            });
        });

        it('not add a message', function () {
            inject(function (chatFactory) {
//                controller.messages = ChatFactory;
                controller.addMessage(null);
                expect(chatFactory.add).not.toHaveBeenCalled();
            });
        });
    });
});