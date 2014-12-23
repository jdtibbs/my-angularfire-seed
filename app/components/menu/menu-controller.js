'use strict';
angular.module('my.menu.controller', ['login.module'])

        .controller('menuController', ['$scope', '$location', 'loginFactory', function ($scope, $location, loginFactory) {
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
                $scope.logout = function () {
                    loginFactory.logout();
                    $location.path('/home');
                };
            }]);