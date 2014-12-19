(function () {
    'user strict';

// https://github.com/johnpapa/angularjs-styleguide#style-y110
// Use a decorator, at config time using the $provide service, 
// on the $exceptionHandler service to perform custom actions when exceptions occur.
    angular.module('exception.module')
            .config(exceptionConfig);

    exceptionConfig.$inject = ['$provide'];

    function exceptionConfig($provide) {
        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }

    extendExceptionHandler.$inject = ['$delegate', '$log'];

    function extendExceptionHandler($delegate, $log) {
        return function (exception, cause) {
            $delegate(exception, cause);
            var errorData = {
                exception: exception,
                cause: cause
            };
            /**
             * Could add the error to a service's collection,
             * add errors to $rootScope, log errors to remote web server,
             * or log locally. Or throw hard. It is entirely up to you.
             * throw exception;
             */

            // TODO determine how to handle errors
            // toastr.error(exception.msg, errorData);
            $log.log('exception-decorator: ', errorData.exception);
            $log.log('exception-decorator: ', errorData.cause);
        };
    }
})();