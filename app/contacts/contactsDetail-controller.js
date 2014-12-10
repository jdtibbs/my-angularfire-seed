'use strict';

angular.module('my.contactsDetail.controller', ['my.contacts.factory', 'ngRoute'])
        .config(["$routeProvider", function ($routeProvider) {
                $routeProvider.when("/contactsDetail", {
                    // the rest is the same for ui-router and ngRoute...
                    controller: "contactsDetailController",
                    templateUrl: "contacts/contactsDetail.html",
                    resolve: {
                        "currentAuth": ['firebaseFactory', function (firebaseFactory) {
                                return firebaseFactory.auth().$requireAuth();
                            }]
                    }
                }).when("/contactsDetail/:id", {
                    // the rest is the same for ui-router and ngRoute...
                    controller: "contactsDetailController",
                    templateUrl: "contacts/contactsDetail.html",
                    resolve: {
                        "currentAuth": ['firebaseFactory', function (firebaseFactory) {
                                return firebaseFactory.auth().$requireAuth();
                            }]
                    }
                });
            }])

        .controller('contactsDetailController', ['$scope', '$routeParams', '$location', 'contactsFactory',
            function ($scope, $routeParams, $location, contactsFactory) {
                $scope.errors = [];
                if ($routeParams.id) {
                    $scope.contact = contactsFactory.syncObject($routeParams.id);
                } else {
                    $scope.contact = {users: ""};
                }

                $scope.add = function (contact) {
                    contactsFactory.add(contact)
                            .then(function (ref) {
                                console.log('add OK: ' + ref.key());
                                $scope.errors = [];
                            })
                            .catch(function (error) {
                                console.log('add Error: ' + error);
                                $scope.errors = error;
                            });
                };

                $scope.save = function () {
                    contactsFactory.save($scope.contact).then(function (ref) {
                        console.log('saved OK ' + ref.key());
                        $scope.errors = [];
                    }).catch(function (error) {
                        console.log('save error: ' + error);
                        $scope.errors = error;
                    });
                };

                $scope.cancel = function () {
                    $location.path('/contacts');
                };
            }]);


