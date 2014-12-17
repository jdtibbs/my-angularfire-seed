'use strict';
angular.module('my.users.factory', ['my.firebase.factory'])

        .constant('USERS_URL', 'users')

        .factory('usersValidator', ['$q',
            function ($q) {
                var validate = {
                    validate: function (user) {
                        var def = $q.defer();
                        var errors = [];
                        if (!user) {
                            errors.push('Missing parameter.');
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
                return validate;
            }])

        .factory('usersFirebaseFactory', ['USERS_URL', 'usersValidator', 'firebaseFactory',
            function (USERS_URL, usersValidator, firebaseFactory) {

                var firebase = {
                    syncArray: function () {
                        return firebaseFactory.syncArray(USERS_URL);
                    },
                    syncObject: function (id) {
                        return firebaseFactory.syncObject([USERS_URL, id]);
                    },
                    add: function (user) {
                        return firebaseFactory.add(USERS_URL, user, usersValidator.validate);
                    },
                    save: function (user) {
                        return firebaseFactory.save(user, usersValidator.validate);
                    }
                };
                return firebase;
            }]);