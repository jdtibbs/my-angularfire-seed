// SEE:
// https://docs.angularjs.org/api/ngMock/function/angular.mock.dump
// --Method for serializing common angular objects (scope, elements, etc..) 
//      into strings, useful for debugging.
// https://docs.angularjs.org/api/ngMock/function/angular.mock.module
// -- This function registers a module configuration code. 
//      It collects the configuration information which will be used when 
//      the injector is created by inject.
// https://docs.angularjs.org/api/ngMock/function/angular.mock.inject
// -- The inject function wraps a function into an injectable function. 
//      The inject() creates new instance of $injector per test, 
//      which is then used for resolving references.
// https://docs.angularjs.org/api/auto/service/$provide
// -- The $provide service has a number of methods for registering components 
//      with the $injector. 
//      Many of these functions are also exposed on angular.Module.

// module:
// Usage
// angular.mock.module(fns);
// where fns is: string, function(), or Object.

// inject:
// Usage
// angular.mock.inject(fns);
// where fns is: function()

angular.module('myApplicationModule', [])
        .value('mode', 'app')
        .value('version', 'v1.0.1');


describe('MyApp', function () {
    'use strict';

    // You need to load modules that you want to test,
    // it loads only the "ng" module by default.
    beforeEach(module('myApplicationModule'));


    // inject() is used to inject arguments of all given functions
    it('should provide a version', inject(function (mode, version) {
        expect(version).toEqual('v1.0.1');
        expect(mode).toEqual('app');
    }));


    // The inject and module method can also be used inside of the it or beforeEach
    it('should override a version and test the new version is injected', function () {
        // module() takes functions or strings (module aliases)
        module(function ($provide) {
            $provide.value('version', 'overridden'); // override version here
        });

        inject(function (version) {
            expect(version).toEqual('overridden');
        });
    });
});