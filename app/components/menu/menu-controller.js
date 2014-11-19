'use strict';
angular.module('my.menu.controller', ['my.user.factory'])

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
                            "url": "#/user"
                        }],
                    "home": "#/home",
                    "selected": "x"
                };
            }]);