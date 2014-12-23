(function () {
    'use strict';

    angular.module('login.module')
            .run(config);

    config.$inject = ['$rootScope', '$location', 'firebaseFactory'];

    function config($rootScope, $location, firebaseFactory) {
        // TODO find way to not use $rootScope
        $rootScope.$on("$routeChangeError", function (event, next, previous, error) {
            // We can catch the error thrown when the $requireAuth promise is rejected
            // and redirect the user back to the home page
            if (error === "AUTH_REQUIRED") {
                $location.path("/login");
            }
        });
        firebaseFactory.auth().$onAuth(function (auth) {
            // placing into rootscope so can use everywhere.
            $rootScope.auth = auth;
        });
        $rootScope.$on('$destroy', function () {
            firebaseFactory.auth().$offAuth();
        });
    }
})();
