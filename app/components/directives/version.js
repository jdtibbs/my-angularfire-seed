(function () {
    'use strict';

    angular.module('directives.module')

            .directive('appVersion', ['version', function (version) {
                    return function (scope, elm) {
                        elm.text(version);
                    };
                }]);
})();