'use strict';

angular.module('my.home.controller', ['my.firebase.factory'])
        .controller('homeController', ['$scope', 'firebaseFactory', 'user', 'FBURL', function ($scope, firebaseFactory, user, FBURL) {
                $scope.syncedValue = firebaseFactory.syncObject('syncedValue');
                $scope.user = user;
                $scope.FBURL = FBURL;
            }]);