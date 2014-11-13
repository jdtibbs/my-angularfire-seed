'use strict';

angular.module('home.controller', ['firebase.utils'])
        .controller('homeController', ['$scope', 'fbutil', 'user', 'FBURL', function ($scope, fbutil, user, FBURL) {
                $scope.syncedValue = fbutil.syncObject('syncedValue');
                $scope.user = user;
                $scope.FBURL = FBURL;
            }]);