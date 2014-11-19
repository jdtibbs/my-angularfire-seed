'use strict';

angular.module('my.home.controller', ['my.firebase.factory'])
        .controller('homeController', ['$scope', 'firebaseFactory', 'FBURL',
            function ($scope, firebaseFactory, FBURL) {
                $scope.syncedValue = firebaseFactory.syncObject('syncedValue');
                $scope.FBURL = FBURL;
            }]);