'use strict';
angular.module('my.menu.controller', ['my.user.factory'])

        .controller('menuController', ['$scope', '$location', 'userFactory', function ($scope, $location, userFactory) {
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
                    userFactory.logout();
                    $location.path('/home');
                };
            }]);