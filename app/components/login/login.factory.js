(function () {

    'use strict';

    angular.module('login.module')
            .factory('loginFactory', factory);

    factory.$inject = ['firebaseAuthFactory', 'loginDaoFactory', 'userDaoFactory', '$q'];

    function factory(firebaseAuthFactory, loginDaoFactory, userDaoFactory, $q) {
        var factory = {
            login: function(email, pass){
                return firebaseAuthFactory.login(email, pass);
            },
            logout: function(){
                firebaseAuthFactory.logout();
            },
            register: register
        };
        return factory;

        function register(profile, email, password) {
            var def = $q.defer();
            firebaseAuthFactory.createUser(email, password)
                    .then(function () {
                        firebaseAuthFactory.login(email, password)
                                .then(function (auth) {
                                    userDaoFactory.add(profile)
                                            .then(function (profileRef) {
                                                loginDaoFactory.createLogin(auth, email, profileRef.key())
                                                        .then(function (loginRef) {
                                                            def.resolve(loginRef);
                                                        })
                                                        .catch(function (error) {
                                                            //TODO back out data.
                                                            def.reject(error);
                                                        });
                                            })
                                            .catch(function (error) {
                                                //TODO back out data.
                                                def.reject(error);
                                            });
                                })
                                .catch(function (error) {
                                    //TODO back out data.
                                    def.reject(error);
                                });
                    })
                    .catch(function (error) {
                        def.reject(error);
                    });
            return def.promise;
        }
    }
})();