(function () {
    'use strict';
    // TODO implement this.
    
    // https://github.com/johnpapa/angularjs-styleguide#style-y111
    // Create a factory that exposes an interface to catch and gracefully handle exceptions.
    angular.module('app.exception.blocks')
            .factory('exceptionBlocksFactory', exception);

    // logger = custom interface.
    // exception.$inject = [logger];
    exception.$inject = ['$log'];

    // function exception(logger) {
    function exception($log) {
        var service = {
            catcher: catcher
        };
        return service;

        function catcher(message) {
            return function (reason) {
                //logger.error(message, reason);
                $log.error(message, reason);
            };
        }
    }
})();