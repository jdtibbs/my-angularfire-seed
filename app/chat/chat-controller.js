'use strict';

angular.module('chatModule', [])
        .controller('chatController', ['$scope', 'messageList', function ($scope, messageList) {
                $scope.messages = messageList;
                $scope.addMessage = function (newMessage) {
                    if (newMessage) {
                        $scope.messages.$add({text: newMessage});
                    }
                };
            }]);