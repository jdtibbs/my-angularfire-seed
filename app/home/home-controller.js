'use strict';

angular.module('my.home.controller', ['firebase.module', 'ngRoute'])
        .config(["$routeProvider", function ($routeProvider) {
                $routeProvider.when("/home", {
                    // the rest is the same for ui-router and ngRoute...
                    controller: "homeController",
                    templateUrl: "app/home/home.html",
                    resolve: {
                        // controller will not be loaded until $waitForAuth resolves
                        // Auth refers to our $firebaseAuth wrapper in the example above
                        "currentAuth": ['firebaseFactory', function (firebaseFactory) {
                                // $waitForAuth returns a promise so the resolve waits for it to complete
                                return firebaseFactory.auth().$waitForAuth();
                            }]
                    }
                }).otherwise({
                    redirectTo: '/home'});
            }])

        .controller('homeController', ['$scope', 'firebaseFactory', 'FBURL',
            function ($scope, firebaseFactory, FBURL) {
                $scope.syncedValue = firebaseFactory.syncObject('syncedValue');
                $scope.FBURL = FBURL;
            }]);