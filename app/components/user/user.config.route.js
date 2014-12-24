(function () {

    'use strict';
    angular.module('user.module')
            .config(config);
    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider.when('/user/profile', {
            controller: 'ProfileController',
            controllerAs: 'user',
            templateUrl: 'components/user/profile/profile.html',
            resolve: {
                // controller will not be loaded until $requireAuth resolves
                // Auth refers to our $firebaseAuth wrapper in the example above
                auth: getAuth,
                profile: getProfile
            }
        }
        ).when('/user/password', {
            controller: 'PasswordController',
            controllerAs: 'user',
            templateUrl: 'components/user/password/password.html',
            resolve: {
                // controller will not be loaded until $requireAuth resolves
                // Auth refers to our $firebaseAuth wrapper in the example above
                auth: getAuth,
                profile: getProfile
            }
        }
        ).when('/user/email', {
            controller: 'EmailController',
            controllerAs: 'user',
            templateUrl: 'components/user/email/email.html',
            resolve: {
                // controller will not be loaded until $requireAuth resolves
                // Auth refers to our $firebaseAuth wrapper in the example above
                auth: getAuth,
                profile: getProfile
            }
        }
        );
    }

    getAuth.$inject = ['firebaseFactory'];
    function getAuth(firebaseFactory) {
        // $requireAuth returns a promise so the resolve waits for it to complete
        // If the promise is rejected, it will throw a $stateChangeError (see above)
        return firebaseFactory.auth().$requireAuth();
    }

    getProfile.$inject = ['firebaseFactory', 'loginDaoFactory', 'userDaoFactory', '$q'];

    function getProfile(firebaseFactory, loginDaoFactory, userDaoFactory, $q) {
        var def = $q.defer();
        firebaseFactory.auth().$requireAuth()
                .then(function (auth) {
                    loginDaoFactory.syncObject(auth.uid).$loaded()
                            .then(function (login) {
                                userDaoFactory.syncObject(login.users).$loaded()
                                        .then(function (profile) {
                                            def.resolve(profile);
                                        })
                                        .catch(function (error) {
                                            def.reject(error);
                                        });
                            })
                            .catch(function (error) {
                                def.reject(error);
                            });
                })
                .catch(function (error) {
                    def.reject(error);
                });
        return def.promise;
    }

})();