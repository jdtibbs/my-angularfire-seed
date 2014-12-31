'use strict';

angular.module('my.inventory.controller', ['my.inventory.factory', 'ngRoute'])
        .config(["$routeProvider", function ($routeProvider) {
                $routeProvider.when("/inventory", {
                    // the rest is the same for ui-router and ngRoute...
                    controller: "inventoryController",
                    templateUrl: "app/inventory/inventory.html"/*,
                     resolve: {
                     "currentAuth": ['firebaseFactory', function (firebaseFactory) {
                     return firebaseFactory.auth().$requireAuth();
                     }]
                     }*/
                });
            }])

        .controller('inventoryController', ['$scope', '$location', 'inventoryFirebaseFactory',
            function ($scope, $location, inventoryFirebaseFactory) {
                $scope.inventory = inventoryFirebaseFactory.syncArray();
                $scope.add = function () {
                    $location.path('/inventoryDetail');
                };
                $scope.edit = function (id) {
                    $location.path('/inventoryDetail/' + id);
                };
            }]);