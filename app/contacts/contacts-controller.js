'use strict';

angular.module('my.contacts.controller', ['my.contacts.factory', 'ngRoute'])
        .config(["$routeProvider", function ($routeProvider) {
                $routeProvider.when("/contacts", {
                    // the rest is the same for ui-router and ngRoute...
                    controller: "contactsController",
                    templateUrl: "contacts/contacts.html",
                    resolve: {
                        "currentAuth": ['firebaseFactory', function (firebaseFactory) {
                                return firebaseFactory.auth().$requireAuth();
                            }]
                    }
                });
            }])

        .controller('contactsController', ['$scope', '$location', 'contactsFactory', function ($scope, $location, contactsFactory) {
                $scope.contacts = contactsFactory.syncArray();
                $scope.add = function () {
                    $location.path('/contactsDetail');
                };
                $scope.edit = function (id) {
                    $location.path('/contactsDetail/' + id);
                }
            }]);
