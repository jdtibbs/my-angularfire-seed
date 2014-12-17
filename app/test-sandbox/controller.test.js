describe('PasswordController', function () {
    'use strict';

    // load the module that contains the 'module' to be tested.
    beforeEach(module('app.controller'));

    var $controller;

    // 2 options to inject services.

    // 1.
    //    beforeEach(inject(function (_$controller_) {
    //        // The injector unwraps the underscores (_) from around the parameter names when matching
    //        $controller = _$controller_;
    //    }));

    // 2.
    beforeEach(inject(function ($injector) {
        // The $controller service is used to create instances of controllers
        $controller = $injector.get('$controller');
    }));

    describe('grade', function () {
        // create the controller being tested.  Also inject dependencies here.
        var controller;    
        beforeEach(function () {
            controller = $controller('PasswordController');
        });

        it('sets the strength to "strong" if the password length is >8 chars', function () {
            controller.password = 'longerthaneightchars';
            controller.grade();
            expect(controller.strength).toEqual('strong');
        });

        it('sets the strength to "weak" if the password length <3 chars', function () {
            controller.password = 'a';
            controller.grade();
            expect(controller.strength).toEqual('weak');
        });
    });
});