'use strict';
angular.module('my.contacts.factory', ['my.firebase.factory'])

        .factory('contactsFactory', ['firebaseFactory', '$q', function (firebaseFactory, $q) {

                var factory = {
                    syncArray: function () {
                        return firebaseFactory.syncArray('contacts');
                    },
                    syncObject: function (id) {
                        return firebaseFactory.syncObject('contacts' + '/' + id);
                    },
                    add: function (contact) {
                        return factory.validate(contact)
                                .then(function (contact) {
                                    return factory.syncArray().$add(contact);
                                });
                    },
                    save: function (contact) {
                        return factory.validate(contact)
                                .then(function (contact) {
                                    return contact.$save();
                                });
                    },
                    validate: function (contact) {
                        var def = $q.defer();
                        var errors = [];
                        if (!contact || !contact.name || contact.name.length > 100) {
                            errors.push('Name must be between 1 and 100 charaters in length.');
                        }
                        if (!contact || !contact.belongsTo) {
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

