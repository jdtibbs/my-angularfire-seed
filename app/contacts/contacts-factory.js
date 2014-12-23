'use strict';
angular.module('my.contacts.factory', ['firebase.module', 'login.module'])
        .constant('CONTACTS_URL', 'contacts')

        .factory('contactsValidator', ['$q', function ($q) {
                var validator = {
                    validate: function (contact) {
                        var def = $q.defer();
                        var errors = [];
                        if (!contact || !contact.name) {
                            errors.push('Name is required.');
                        } else if (contact.name.length > 100) {
                            errors.push('Name must be 100 charaters or less.');
                        } else if (!contact.users) {
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
                return validator;
            }])

        .factory('contactsFirebaseFactory', ['CONTACTS_URL', 'contactsValidator', 'firebaseFactory', 'loginDaoFactory',
            function (CONTACTS_URL, contactsValidator, firebaseFactory, loginDaoFactory) {

                var firebase = {
                    syncArray: function () {
                        return loginDaoFactory.getLogin()
                                .then(function (login) {
                                    return firebaseFactory.syncArray([CONTACTS_URL], {orderByChild: 'users', equalTo: login.users});
                                });
                    },
                    syncObject: function (id) {
                        return firebaseFactory.syncObject([CONTACTS_URL, id]);
                    },
                    add: function (contact) {
                        return loginDaoFactory.getLogin()
                                .then(function (login) {
                                    contact.users = login.users;
                                    return firebaseFactory.add(CONTACTS_URL, contact, contactsValidator.validate);
                                });
                    },
                    save: function (contact) {
                        return firebaseFactory.save(contact, contactsValidator.validate);
                    },
                    delete: function (contact) {
                        return firebaseFactory.delete([CONTACTS_URL, contact.$id]);
                    }
                };
                return firebase;
            }]);

