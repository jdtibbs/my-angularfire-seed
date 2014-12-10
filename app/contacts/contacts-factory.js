'use strict';
angular.module('my.contacts.factory', ['my.firebase.factory', 'my.login.service'])

        .factory('contactsFactory', ['firebaseFactory', 'loginService', '$q',
            function (firebaseFactory, loginService, $q) {

                var factory = {
                    ref: function () {
                        return firebaseFactory.ref('contacts');
                    },
                    syncArray: function () {
                        return loginService.getLogin()
                                .then(function (login) {
                                    console.log(login.users);
                                    return firebaseFactory.syncArray('contacts', {orderByChild: 'users', equalTo: login.users});
                                });
                    },
                    syncObject: function (id) {
                        return firebaseFactory.syncObject('contacts' + '/' + id);
                    },
                    add: function (contact) {
                        return loginService.getLogin()
                                .then(function (login) {
                                    contact.users = login.users;
                                    return factory.validate(contact)
                                            .then(function (contact) {
                                                return factory.syncArray(contact.users)
                                                        .then(function (array) {
                                                            return array.$add(contact);
                                                        });
                                            });
                                });
                        // TODO jdtibbs, insure validate errors reach UI.
                    },
                    save: function (contact) {
                        return factory.validate(contact)
                                .then(function (contact) {
                                    return contact.$save();
                                });
                        // TODO jdtibbs, insure validate errors reach UI.
                    },
                    validate: function (contact) {
                        var def = $q.defer();
                        var errors = [];
                        if (!contact || !contact.name || contact.name.length > 100) {
                            errors.push('Name must be between 1 and 100 charaters in length.');
                        }
                        if (!contact || !contact.users) {
                            errors.push('You must be logged in to add or update a contact.');
                        }
                        if (errors.length > 0) {
                            def.reject(errors);
                        } else {
                            def.resolve(contact);
                        }
                        return def.promise;
                    }
                };
                return factory;
            }]);

