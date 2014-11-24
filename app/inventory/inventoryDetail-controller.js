'use strict';

angular.module('my.inventoryDetail.controller', ['my.inventory.factory'])
        .controller('inventoryDetailController', ['$scope', '$routeParams', '$location', 'inventoryFactory', function ($scope, $routeParams, $location, inventoryFactory) {
                if ($routeParams.id) {
                    $scope.item = inventoryFactory.syncObject($routeParams.id);
                    // console.log($scope.item);
                } else {
                    $scope.item = {};
                }

                $scope.add = function (item) {
                    inventoryFactory.syncArray().$add(item);
                };

                $scope.save = function () {
                    $scope.item.$save();
                };

                $scope.cancel = function () {
                    $location.path('/inventory');
                };
            }]);


