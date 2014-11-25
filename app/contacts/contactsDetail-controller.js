'use strict';

angular.module('my.contactsDetail.controller', ['my.contacts.factory'])
        .controller('contactsDetailController', ['$scope', '$routeParams', '$location', 'contactsFactory', 'currentAuth', function ($scope, $routeParams, $location, contactsFactory, currentAuth) {
                if ($routeParams.id) {
                    $scope.contact = contactsFactory.syncObject($routeParams.id);
                    // console.log($scope.contact);
                } else {
                    $scope.contact = {belongsTo: ""};
                }

                $scope.add = function (contact) {
                    // TODO add user_id to secure to user who added.                     
                    contact.belongsTo = currentAuth.uid;
                    contactsFactory.syncArray().$add(contact);
                };

                $scope.save = function () {
                    $scope.contact.$save();
                };

                $scope.cancel = function () {
                    $location.path('/contacts');
                };
            }]);


