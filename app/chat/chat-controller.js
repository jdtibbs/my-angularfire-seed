'use strict';

angular.module('chat.controller', ['chat.factory'])
        .controller('chatController', ['$scope', 'message', function ($scope, message) {
                $scope.messages = message;
                $scope.addMessage = function (newMessage) {
                    if (newMessage) {
                        $scope.messages.$add({text: newMessage});
                    }
                };
            }]);