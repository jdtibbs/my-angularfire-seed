'use strict';

angular.module('menu.controller', [])
        .controller('menuController', ['$scope', function ($scope) {
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