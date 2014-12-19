// https://github.com/johnpapa/angularjs-styleguide#style-y010
// Wrap AngularJS components in an Immediately Invoked Function Expression (IIFE).
(function () {
    'use strict';

    // define the module, inculding module dependencies.
    // https://github.com/johnpapa/angularjs-styleguide#style-y021
    // Declare modules without a variable using the setter syntax.
    // including [], this sets/creates the module.
    angular.module('chat.module', [
        'ngRoute'
    ]);
})();