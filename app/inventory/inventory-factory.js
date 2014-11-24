'use strict';
angular.module('my.inventory.factory', ['my.firebase.factory', 'firebase'])

        .factory('inventoryFactory', ['firebaseFactory', '$firebase', '$q', function (firebaseFactory, $firebase, $q) {

                var factory = {
                    syncArray: function () {
                        return firebaseFactory.syncArray('inventory');
                    },
                    syncObject: function (id) {
                        return firebaseFactory.syncObject('inventory' + '/' + id);
                    }
                };
                return factory;
            }]);