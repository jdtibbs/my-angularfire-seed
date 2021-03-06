'use strict';

angular.module('my.contacts.controller', ['my.contacts.factory', 'ngRoute'])
        .config(["$routeProvider", function ($routeProvider) {
                $routeProvider.when("/contacts", {
                    // the rest is the same for ui-router and ngRoute...
                    controller: "contactsController",
                    templateUrl: "app/contacts/contacts.html",
                    resolve: {
                        "currentAuth": ['firebaseFactory', function (firebaseFactory) {
                                return firebaseFactory.auth().$requireAuth();
                            }]
                    }
                });
            }])

        .controller('contactsController', ['$scope', '$location', 'contactsFirebaseFactory',
            function ($scope, $location, contactsFirebaseFactory) {

                contactsFirebaseFactory.syncArray()
                        .then(function (contacts) {
                            $scope.contacts = contacts;
                        });

                $scope.add = function () {
                    $location.path('/contactsDetail');
                };
                $scope.edit = function (id) {
                    $location.path('/contactsDetail/' + id);
                };
            }]);
