'use strict';
angular.module('my.inventory.factory', ['my.firebase.factory', 'firebase'])

        .constant('INVENTORY_URL', 'inventory')

        .factory('inventoryValidator', ['$q', function ($q) {
                var validator = {
                    validate: function (item) {
                        var def = $q.defer();
                        var errors = [];
                        if (!item || !item.name || item.name.length > 100) {
                            errors.push('Name must be between 1 and 100 charaters in length.');
                        }
//                        if (/\D/.test(item.quantity)) {
                        if (!angular.isNumber(item.quantity)) {
                            /* non-digit found */
                            errors.push('Quantity must be a number.');
                        } else if (item.quantity < 0 || item.quantity > 1000) {
                            errors.push('Quantity must be between 0 and 1000.');
                        }
                        if (errors.length > 0) {
                            def.reject(errors);
                        } else {
                            def.resolve(item);
                        }
                        return def.promise;
                    }
                };
                return validator;
            }])

        .factory('inventoryFirebaseFactory', ['INVENTORY_URL', 'firebaseFactory', 'inventoryValidator',
            function (INVENTORY_URL, firebaseFactory, inventoryValidator) {

                var firebase = {
                    syncArray: function () {
                        return firebaseFactory.syncArray(INVENTORY_URL);
                    },
                    syncObject: function (id) {
                        return firebaseFactory.syncObject([INVENTORY_URL, id]);
                    },
                    add: function (item) {
                        return firebaseFactory.add(INVENTORY_URL, item, inventoryValidator.validate);
                    },
                    save: function (item) {
                        return firebaseFactory.save(item, inventoryValidator.validate);
                    },
                    delete: function (item) {
                        return firebaseFactory.delete(INVENTORY_URL, item);
                    }
                };
                return firebase;
            }]);