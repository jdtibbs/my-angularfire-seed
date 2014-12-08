'use strict';
angular.module('my.menu.controller', ['my.login.service'])

        .controller('menuController', ['$scope', '$location', 'loginService', function ($scope, $location, loginService) {
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
                    loginService.logout();
                    $location.path('/home');
                };
            }]);