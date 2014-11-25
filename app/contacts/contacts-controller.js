'use strict';

angular.module('my.contacts.controller', ['my.contacts.factory'])
        .controller('contactsController', ['$scope', '$location', 'contactsFactory', function ($scope, $location, contactsFactory) {
                $scope.contacts = contactsFactory.syncArray();
                $scope.add = function () {
                    $location.path('/contactsDetail');
                };
            }]);
