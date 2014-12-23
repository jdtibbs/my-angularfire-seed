(function () {

    'use strict';

    angular.module('new.module')
            .factory('newFactory', factory);

    factory.$inject = [/* 'someDependency' */];

    function factory(/* someDependency */) {
        var factory = {
            someFn: function () {
                // return someFactory.someFn();
            },
            someFn2: function (/* param */) {
                // return someFactory.someFn(param);
            }
        };
        return factory;
    }
})();