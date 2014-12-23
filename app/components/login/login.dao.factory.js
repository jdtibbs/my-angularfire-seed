(function () {

    'use strict';

    angular.module('login.module')
            .factory('loginDaoFactory', factory);

    factory.$inject = ['LOGIN_URL', 'loginValidateFactory', 'firebaseFactory', 'firebaseAuthFactory', '$q', '$log'];

    function factory(LOGIN_URL, loginValidateFactory, firebaseFactory, firebaseAuthFactory, $q, $log) {
        var factory = {
            ref: function (id) {
                return firebaseFactory.ref(LOGIN_URL, id);
            },
            syncObject: function (id) {
                return firebaseFactory.syncObject([LOGIN_URL, id]);
            },
            create: function (email, userId) {
                return {email: email, users: userId};
            },
            add: function (id, login) {
                var def = $q.defer();
                if (!id) {
                    def.reject('Id is required.');
                } else if (!login) {
                    def.reject('Login is required.');
                } else {
                    loginValidateFactory.validate(login)
                            .then(function (login) {
                                var ref = firebaseFactory.ref(LOGIN_URL);
                                ref.child(id).set(login, function (error) {
                                    if (error) {
                                        def.reject(error);
                                    } else {
                                        def.resolve();
                                    }
                                });
                            })
                            .catch(function (error) {
                                def.reject(error);
                            });
                }
                return def.promise;
            },
            createLogin: function (auth, email, users) {
                var def = $q.defer();
                var login = factory.create(email, users);
                $log.debug('createLogin: ' + login.email + ' ' + login.users);
                factory.add(auth.uid, login)
                        .then(function () {
                            $log.debug('Login created');
                            def.resolve();
                        })
                        .catch(function (error) {
                            def.reject(error);
                        });
                return def.promise;
            },
            getLogin: function () {
                var def = $q.defer();
                firebaseAuthFactory.getUid()
                        .then(function (uid) {
                            factory.syncObject(uid).$loaded()
                                    .then(function (login) {
                                        def.resolve(login);
                                    });
                        })
                        .catch(function (error) {
                            def.reject(error);
                        });
                return def.promise;
            },
            removeLogin: function (authUid) {
                var def = $q.defer();
                var login = factory.ref(authUid);
                login.remove(function (error) {
                    if (error) {
                        def.reject(error);
                    } else {
                        def.resolve();
                    }
                });
                return def.promise;
            }
        };
        return factory;
    }
})();