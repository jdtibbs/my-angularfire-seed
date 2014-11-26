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

        .controller('contactsDetailController', ['$scope', '$routeParams', '$location', 'contactsFactory', 'currentAuth', function ($scope, $routeParams, $location, contactsFactory, currentAuth) {
                if ($routeParams.id) {
                    $scope.contact = contactsFactory.syncObject($routeParams.id);
                    // console.log($scope.contact);
                } else {
                    $scope.contact = {belongsTo: ""};
                }

                $scope.add = function (contact) {
                    // add user_id to secure it to user who added.                     
                    contact.belongsTo = currentAuth.uid;
                    contactsFactory.syncArray().$add(contact);
                };

                $scope.save = function () {
                    $scope.contact.$save().then(function (ref) {
                        console.log('saved OK');
                    }).catch(function (error) {
                        console.log('save error: ' + error);
                    });
                };

                $scope.cancel = function () {
                    $location.path('/contacts');
                };
            }]);


