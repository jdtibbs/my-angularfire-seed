'use strict';
angular.module('my.contacts.factory', ['my.firebase.factory'])

        .factory('contactsFactory', ['firebaseFactory', '$q', function (firebaseFactory, $q) {

                var factory = {
                    syncArray: function () {
                        return firebaseFactory.syncArray('contacts');
                    },
                    syncObject: function (id) {
                        return firebaseFactory.syncObject('contacts' + '/' + id);
                    }
                };
                return factory;
            }]);

