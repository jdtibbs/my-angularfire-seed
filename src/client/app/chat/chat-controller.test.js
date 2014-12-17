describe('testing: chat-controller', function () {
    'use strict';

    beforeEach(function () {
        module('my.chat.controller');
        module(function ($provide) {
            $provide.value('message', messageStub());
        });
    });


    function messageStub() {
        var obj = jasmine.createSpyObj('message', ['$add']);
        obj.$add.andCallFake(function () {
            return {};
        });
        return obj;
    }

    var $controller;
    var message;
    
    beforeEach(inject(function ($injector) {
        // The $controller service is used to create instances of controllers
        $controller = $injector.get('$controller');
        message = $injector.get('message');
    }));

    describe('chatControler suite', function () {
        var controller;

        beforeEach(function () {
            controller = $controller('chatController', {message: message});
        });

        it('controller is created', function () {
            expect(controller).toBeDefined();
        });

        it('add a message', function () {
            inject(function (message) {
                controller.messages = message;
                controller.addMessage('fred');
                expect(message.$add).toHaveBeenCalled();
            });
        });

        it('not add a message', function () {
            inject(function (message) {
                controller.messages = message;
                controller.addMessage(null);
                expect(message.$add).not.toHaveBeenCalled();
            });
        });
    });
});