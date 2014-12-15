'use strict';

angular.module('my.chat.controller', ['my.chat.factory', 'ngRoute'])
        .config(["$routeProvider", function ($routeProvider) {
                $routeProvider.when("/chat", {
                    // the rest is the same for ui-router and ngRoute...
                    controller: "chatController as chat",
                    templateUrl: "chat/chat.html"
                });
            }])

        .controller('chatController', ['message', function (message) {
                this.messages = message;
                this.addMessage = function (newMessage) {
                    if (newMessage) {
                        this.messages.$add({text: newMessage});
                    }
                };
            }]);