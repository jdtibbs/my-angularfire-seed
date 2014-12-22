(function () {

    'use strict';

    angular.module('user.module')
            .config(Config);

    Config.$inject = ['$routeProvider'];

    function Config($routeProvider) {
        $routeProvider.when('/user', {
            controller: 'userController',
            controllerAs: 'user',
            templateUrl: 'components/user/user.html',
            resolve: {
                // controller will not be loaded until $requireAuth resolves
                // Auth refers to our $firebaseAuth wrapper in the example above
                currentAuth: currentAuth
            }
        }
        );
    }

    currentAuth.$inject = ['firebaseFactory'];

    function currentAuth(firebaseFactory) {
        // $requireAuth returns a promise so the resolve waits for it to complete
        // If the promise is rejected, it will throw a $stateChangeError (see above)
        return firebaseFactory.auth().$requireAuth();
    }

})();