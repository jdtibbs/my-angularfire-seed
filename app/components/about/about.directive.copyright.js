(function () {
    'use strict';

    angular.module('about.module')
            .directive('copyright', copyright);

    copyright.$inject = ['copyright'];

    function copyright(copyright) {
        return function (scope, elm) {
            elm.text(copyright);
        };
    }
})();
