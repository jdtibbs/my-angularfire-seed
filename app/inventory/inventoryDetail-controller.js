'use strict';

angular.module('my.inventoryDetail.controller', ['my.inventory.factory', 'ngRoute'])
        .config(["$routeProvider", function ($routeProvider) {
                $routeProvider.when("/inventoryDetail", {
                    // the rest is the same for ui-router and ngRoute...
                    controller: "inventoryDetailController",
                    templateUrl: "inventory/inventoryDetail.html"/*,
                     resolve: {
                     "currentAuth": ['firebaseFactory', function (firebaseFactory) {
                     return firebaseFactory.auth().$requireAuth();
                     }]
                     }*/
                }).when("/inventoryDetail/:id", {
                    // the rest is the same for ui-router and ngRoute...
                    controller: "inventoryDetailController",
                    templateUrl: "inventory/inventoryDetail.html"/*,
                     resolve: {
                     "currentAuth": ['firebaseFactory', function (firebaseFactory) {
                     return firebaseFactory.auth().$requireAuth();
                     }]
                     }*/});
            }])

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


