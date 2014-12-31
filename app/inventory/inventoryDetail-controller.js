'use strict';

angular.module('my.inventoryDetail.controller', ['my.inventory.factory', 'ngRoute'])
        .config(["$routeProvider", function ($routeProvider) {
                $routeProvider.when("/inventoryDetail", {
                    // the rest is the same for ui-router and ngRoute...
                    controller: "inventoryDetailController",
                    templateUrl: "app/inventory/inventoryDetail.html"/*,
                     resolve: {
                     "currentAuth": ['firebaseFactory', function (firebaseFactory) {
                     return firebaseFactory.auth().$requireAuth();
                     }]
                     }*/
                }).when("/inventoryDetail/:id", {
                    // the rest is the same for ui-router and ngRoute...
                    controller: "inventoryDetailController",
                    templateUrl: "app/inventory/inventoryDetail.html"/*,
                     resolve: {
                     "currentAuth": ['firebaseFactory', function (firebaseFactory) {
                     return firebaseFactory.auth().$requireAuth();
                     }]
                     }*/});
            }])

        .controller('inventoryDetailController', ['$scope', '$routeParams', '$location', 'inventoryFirebaseFactory',
            function ($scope, $routeParams, $location, inventoryFirebaseFactory) {
                $scope.errors = [];

                if ($routeParams.id) {
                    $scope.item = inventoryFirebaseFactory.syncObject($routeParams.id);
                } else {
                    $scope.item = {};
                }

                $scope.add = function (item) {
                    inventoryFirebaseFactory.add(item)
                            .then(function (ref) {
                                $scope.errors = [];
                                back();
                            })
                            .catch(function (error) {
                                $scope.errors = error;
                            });
                };

                $scope.save = function () {
                    inventoryFirebaseFactory.save($scope.item)
                            .then(function (ref) {
                                $scope.errors = [];
                                back();
                            })
                            .catch(function (error) {
                                $scope.errors = error;
                            });
                };

                $scope.delete = function () {
                    inventoryFirebaseFactory.delete($scope.item)
                            .then(function () {
                                $scope.errors = [];
                                back();
                            })
                            .catch(function (error) {
                                $scope.errors = error;
                            });
                };

                $scope.cancel = function () {
                    back();
                };

                var back = function () {
                    $location.path('/inventory');
                };
            }]);


