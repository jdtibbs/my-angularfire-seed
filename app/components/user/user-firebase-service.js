'use strict';
angular.module('my.users.firebase.service', ['my.firebase.factory'])

        .service('usersFirebaseService', ['firebaseFactory', '$q', function (firebaseFactory, $q) {
                var FIREBASE_URL = 'users';

                var service = {
                    syncArray: function () {
                        return firebaseFactory.syncArray(FIREBASE_URL);
                    },
                    syncObject: function (id) {
                        return firebaseFactory.syncObject([FIREBASE_URL, id]);
                    },
                    add: function (user) {
                        return service.validate(user)
                                .then(function (user) {
                                    var def = $q.defer();
                                    service.syncArray().$add(user)
                                            .then(function (ref) {
                                                def.resolve(ref);
                                            })
                                            .catch(function (error) {
                                                def.reject(error);
                                            });
                                    return def.promise;
                                });
                    },
                    save: function (user) {
                        return service.validate(user)
                                .then(function (user) {
                                    var def = $q.defer();
                                    user.$save()
                                            .then(function (ref) {
                                                def.resolve(ref);
                                            })
                                            .catch(function (error) {
                                                def.reject(error);
                                            });
                                    return def.promise;
                                });
                    },
                    validate: function (user) {
                        var def = $q.defer();
                        var errors = [];
                        if (!user) {
                            errors.push('Missing parameter.')
                        } else {
                            if (!user.name) {
                                errors.push('Name is required.');
                            }
                            if (!user.businessPhone) {
                                errors.push('Business phone is required.');
                            }
                        }
                        if (errors.length > 0) {
                            def.reject(errors);
                        } else {
                            def.resolve(user);
                        }
                        return def.promise;
                    }
                };
                return service;
            }]);