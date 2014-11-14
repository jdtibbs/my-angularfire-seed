'use strict';

angular.module('my.home.controller', ['firebase.utils'])
        .controller('homeController', ['$scope', 'fbutil', 'user', 'FBURL', function ($scope, fbutil, user, FBURL) {
                $scope.syncedValue = fbutil.syncObject('syncedValue');
                $scope.user = user;
                $scope.FBURL = FBURL;
            }]);