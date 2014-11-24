'use strict';

angular.module('my.inventory.controller', ['my.inventory.factory'])
        .controller('inventoryController', ['$scope', '$location', 'inventoryFactory', function ($scope, $location, inventoryFactory) {
                $scope.inventory = inventoryFactory.syncArray();
                $scope.add = function () {
                    $location.path('/inventoryDetail');
                };
            }]);