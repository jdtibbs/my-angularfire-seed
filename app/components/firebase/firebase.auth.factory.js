(function () {

    'use strict';

    angular.module('firebase.module')
            .factory('firebaseAuthFactory', factory);

    factory.$inject = ['firebaseFactory', '$q', '$log'];

    function factory(firebaseFactory, $q, $log) {
        var INVALID_CREDENTIALS = 'The email and or password is incorrect.';

        var factory = {
            login: function (email, pass) {
                var def = $q.defer();
                if (!email) {
                    def.reject('Email is required to login.');
                } else if (!pass) {
                    def.reject('Password is required to login.');
                } else {
                    firebaseFactory.auth().$authWithPassword({email: email, password: pass})
                            .then(function (authData) {
                                def.resolve(authData);
                            })
                            .catch(function (error) {
                                $log.error(error.message);
                                def.reject(INVALID_CREDENTIALS);
                            });
                }
                return def.promise;
            },
            logout: function () {
                firebaseFactory.auth().$unauth();
            },
            getAuth: function () {
                var def = $q.defer();
                var auth = firebaseFactory.auth().$getAuth();
                if (auth !== null) {
                    def.resolve(auth);
                } else {
                    def.reject('Not logged in.');
                }
                return def.promise;
            },
            getUid: function () {
                var def = $q.defer();
                factory.getAuth().then(function (auth) {
                    $log.debug('auth.uid: ' + auth.uid);
                    def.resolve(auth.uid);
                }).catch(function (error) {
                    def.reject(error);
                });
                return def.promise;
            },
            changePassword: function (email, oldpass, newpass) {
                var def = $q.defer();
                firebaseFactory.auth().$changePassword(email, oldpass, newpass)
                        .then(function () {
                            def.resolve();
                        })
                        .catch(function (error) {
                            $log.log('Error-changePassword: ' + error);
                            switch (error.code) {
                                case 'INVALID_PASSWORD':
                                    def.reject(INVALID_CREDENTIALS);
                                case 'INVALID_USER':
                                    def.reject(INVALID_CREDENTIALS);
                                default:
                                    def.reject(error);
                            }
                        });
                return def.promise;
            },
            createUser: function (email, pass) {
                var def = $q.defer();
                firebaseFactory.auth().$createUser(email, pass)
                        .then(function () {
                            def.resolve();
                        })
                        .catch(function (error) {
                            $log.error(error);
                            switch (error.code) {
                                case 'EMAIL_TAKEN':
                                    def.reject('The new user account cannot be created because the email is already in use.');
                                case 'INVALID_EMAIL':
                                    def.reject('The specified email is not a valid email.');
                                default:
                                    def.reject(error);
                            }
                        });
                return def.promise;
            },
            removeUser: function (email, pass) {
                var def = $q.defer();
                firebaseFactory.auth().$removeUser(email, pass)
                        .then(function () {
                            def.resolve();
                        })
                        .catch(function (error) {
                            $log.log('Error-removeUser: ' + error);
                            switch (error.code) {
                                case 'INVALID_PASSWORD':
                                    def.reject(INVALID_CREDENTIALS);
                                case 'INVALID_USER':
                                    def.reject(INVALID_CREDENTIALS);
                                default:
                                    def.reject(error);
                            }
                        });
                return def.promise;
            }
        };
        return factory;
    }
})();