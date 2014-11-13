'use strict';
/* Controllers */

angular.module('myApp.controllers', ['firebase.utils', 'loginModule'])
        .controller('menuCtrl', ['$scope', function ($scope) {
                $scope.menu = {
                    "items": [{
                            "value": "Chat",
                            "url": "#/chat"
                        }, {
                            "value": "Login",
                            "url": "#/login"
                        }, {
                            "value": "Account",
                            "url": "#/account"
                        }],
                    "home": "#/home",
                    "selected": "x"
                };
            }]);