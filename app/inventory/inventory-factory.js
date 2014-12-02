'use strict';
angular.module('my.inventory.factory', ['my.firebase.factory', 'firebase'])

        .factory('inventoryFactory', ['firebaseFactory', '$firebase', '$q', function (firebaseFactory, $firebase, $q) {

                var factory = {
                    syncArray: function () {
                        return firebaseFactory.syncArray('inventory');
                    },
                    syncObject: function (id) {
                        return firebaseFactory.syncObject('inventory' + '/' + id);
                    },
                    add: function (item) {
                        return factory.validate(item)
                                .then(function (item) {
                                    return factory.syncArray().$add(item);
                                });
                    },
                    save: function (item) {
                        return factory.validate(item)
                                .then(function (item) {
                                    return item.$save();
                                });
                    },
                    validate: function (item) {
                        var def = $q.defer();
                        var errors = [];
                        if (!item || !item.name || item.name.length > 100) {
                            errors.push('Name must be between 1 and 100 charaters in length.');
                        }
                        if (!item || !item.quantity || item.quantity < 0 || item.quantity > 1000) {
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
                return factory;
            }]);