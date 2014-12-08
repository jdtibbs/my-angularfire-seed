'use strict';
angular.module('my.login.service', ['my.firebase.factory'])
        .constant('LOGIN_URL', 'login')

        .constant('INVALID_CREDENTIALS', 'The specified email and or password is incorrect.')

        .service('loginService', ['firebaseFactory', 'LOGIN_URL', 'INVALID_CREDENTIALS', '$q', '$log', function (firebaseFactory, LOGIN_URL, INVALID_CREDENTIALS, $q, $log) {
                var loginService = {
                    login: function (email, pass) {
                        var def = $q.defer();
                        if (!email) {
                            def.reject('Email is required to login.');
                        } else if (!pass) {
                            def.reject('Password is required to login.');
                        } else {
                            firebaseFactory.auth().$authWithPassword({'email': email, 'password': pass})
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
                    // TODO is this used anywhere?
                    getUid: function () {
                        var def = $q.defer();
                        loginService.getAuth().then(function (auth) {
                            def.resolve(auth.uid);
                        }).catch(function (error) {
                            def.reject(error);
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
                    createLogin: function (authUid, email, userId) {
                        var ref = firebaseFactory.ref(LOGIN_URL, authUid);
                        var def = $q.defer();
                        var login = {email: email, userId: userId};
                        // !! set() overwrites existing data at given location.
                        ref.set(login, function (err) {
                            $timeout(function () {
                                if (err) {
                                    def.reject(err);
                                }
                                else {
                                    def.resolve(ref);
                                }
                            });
                        });
                        return def.promise;
                    },
                    getLogin: function (authUid) {
                        var def = $q.defer();
                        var ref = firebaseFactory.ref(LOGIN_URL, authUid);
                        ref.once('value',
                                function (snap) {
                                    if (snap.val()) {
                                        def.resolve(snap.val());
                                    }
                                    else {
                                        def.reject('not found');
                                    }
                                },
                                function (err) {
                                    def.reject(err);
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
                                    console.log('Error-removeUser: ' + error);
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
                    removeLogin: function (authUid) {
                        var d = $q.defer();
                        var ref = firebaseFactory.ref(LOGIN_URL, authUid);
                        ref.remove(function (err) {
                            if (err) {
                                d.reject(err);
                            } else {
                                d.resolve();
                            }
                        });
                        return d.promise;
                    },
                    changePassword: function (email, oldpass, newpass) {
                        var def = $q.defer();
                        firebaseFactory.auth().$changePassword(email, oldpass, newpass)
                                .then(function () {
                                    def.resolve();
                                })
                                .catch(function (error) {
                                    console.log('Error-changePassword: ' + error);
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
                return loginService;
            }]);


