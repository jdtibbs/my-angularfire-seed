(function () {
    'use strict';

    angular.module('about.module')
            .directive('appName', appname);

    appname.$inject = ['appName'];

    function appname(appName) {
        return function (scope, elm) {
            elm.text(appName);
        };
    }
})();
