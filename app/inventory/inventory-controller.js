'use strict';

angular.module('my.inventory.controller', ['my.inventory.factory', 'ngRoute'])
        .config(["$routeProvider", function ($routeProvider) {
                $routeProvider.when("/inventory", {
                    // the rest is the same for ui-router and ngRoute...
                    controller: "inventoryController",
                    templateUrl: "inventory/inventory.html"/*,
                     resolve: {
                     "currentAuth": ['firebaseFactory', function (firebaseFactory) {
                     return firebaseFactory.auth().$requireAuth();
                     }]
                     }*/
                });
            }])

        .controller('inventoryController', ['$scope', '$location', 'inventoryFactory', function ($scope, $location, inventoryFactory) {
                $scope.inventory = inventoryFactory.syncArray();
                $scope.add = function () {
                    $location.path('/inventoryDetail');
                };
                $scope.edit = function (id) {
                    $location.path('/inventoryDetail/' + id);
                };
            }]);