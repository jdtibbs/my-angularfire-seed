'use strict';
angular.module('my.login.firebase.service', ['my.firebase.factory'])

        .service('loginFirebaseService', ['firebaseFactory', '$q', function (firebaseFactory, $q) {
                var FIREBASE_URL = 'login';
                var service = {
                    ref: function (id) {
                        return firebaseFactory.ref(FIREBASE_URL, id);
                    },
                    syncObject: function (id) {
                        return firebaseFactory.syncObject([FIREBASE_URL, id]);
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
                            service.validate(login)
                                    .then(function (login) {
                                        var ref = firebaseFactory.ref(FIREBASE_URL);
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
                    validate: function (login) {
                        var def = $q.defer();
                        var errors = [];
                        if (!login) {
                            errors.push('Missing login parameter.');
                        } else {
                            if (!login || !login.email || login.email.length > 100) {
                                errors.push('Email is required.');
                            }
                            if (!login || !login.users) {
                                errors.push('Users ID is required.');
                            }
                        }
                        if (errors.length > 0) {
                            def.reject(errors);
                        } else {
                            def.resolve(login);
                        }
                        return def.promise;
                    }
                };
                return service;
            }]);