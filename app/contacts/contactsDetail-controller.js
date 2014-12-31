'use strict';

angular.module('my.contactsDetail.controller', ['my.contacts.factory', 'ngRoute'])
        .config(["$routeProvider", function ($routeProvider) {
                $routeProvider.when("/contactsDetail", {
                    // the rest is the same for ui-router and ngRoute...
                    controller: "contactsDetailController",
                    templateUrl: "app/contacts/contactsDetail.html",
                    resolve: {
                        "currentAuth": ['firebaseFactory', function (firebaseFactory) {
                                return firebaseFactory.auth().$requireAuth();
                            }]
                    }
                }).when("/contactsDetail/:id", {
                    // the rest is the same for ui-router and ngRoute...
                    controller: "contactsDetailController",
                    templateUrl: "app/contacts/contactsDetail.html",
                    resolve: {
                        "currentAuth": ['firebaseFactory', function (firebaseFactory) {
                                return firebaseFactory.auth().$requireAuth();
                            }]
                    }
                });
            }])

        .controller('contactsDetailController', ['$scope', '$routeParams', '$location', 'contactsFirebaseFactory',
            function ($scope, $routeParams, $location, contactsFirebaseFactory) {
                $scope.errors = [];
                if ($routeParams.id) {
                    $scope.contact = contactsFirebaseFactory.syncObject($routeParams.id);
                } else {
                    $scope.contact = {users: ""};
                }

                $scope.add = function (contact) {
                    contactsFirebaseFactory.add(contact)
                            .then(function (ref) {
                                $scope.errors = [];
                                back();
                            })
                            .catch(function (error) {
                                $scope.errors = error;
                            });
                };

                $scope.save = function () {
                    contactsFirebaseFactory.save($scope.contact)
                            .then(function (ref) {
                                $scope.errors = [];
                                back();
                            })
                            .catch(function (error) {
                                $scope.errors = error;
                            });
                };

                $scope.delete = function () {
                    contactsFirebaseFactory.delete($scope.contact)
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
                    $location.path('/contacts');
                };
            }]);


