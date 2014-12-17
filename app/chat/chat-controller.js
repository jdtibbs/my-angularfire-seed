'use strict';

angular.module('my.chat.controller', ['my.chat.factory', 'ngRoute'])
        .config(["$routeProvider", function ($routeProvider) {
                $routeProvider.when("/chat", {
                    // the rest is the same for ui-router and ngRoute...
                    controller: "chatController",
                    controllerAs: 'chat',
                    templateUrl: "chat/chat.html"
                });
            }])

        .controller('chatController', ['message', function (message) {
                var self = this;
                self.messages = message;
                self.addMessage = function (newMessage) {
                    if (newMessage) {
                        self.messages.$add({text: newMessage});
                    }
                };
            }]);