describe('PasswordController', function () {
    beforeEach(module('app'));

    var $controller;

    beforeEach(inject(function (_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    describe('grade', function () {
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