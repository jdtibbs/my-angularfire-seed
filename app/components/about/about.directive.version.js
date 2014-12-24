(function () {
    'use strict';

    angular.module('about.module')
            .directive('version', version);

    version.$inject = ['version'];

    function version(version) {
        return function (scope, elm) {
            elm.text(version);
        };
    }
})();
