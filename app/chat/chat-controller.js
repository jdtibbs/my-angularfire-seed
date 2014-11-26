'use strict';

angular.module('my.chat.controller', ['my.chat.factory', 'ngRoute'])
        .config(["$routeProvider", function ($routeProvider) {
                $routeProvider.when("/chat", {
                    // the rest is the same for ui-router and ngRoute...
                    controller: "chatController",
                    templateUrl: "chat/chat.html"
                });
            }])

        .controller('chatController', ['$scope', 'message', function ($scope, message) {
                $scope.messages = message;
                $scope.addMessage = function (newMessage) {
                    if (newMessage) {
                        $scope.messages.$add({text: newMessage});
                    }
                };
            }]);