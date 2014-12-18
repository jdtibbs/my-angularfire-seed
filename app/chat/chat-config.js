(function () {
    'use strict';

// add a config to the module.
    angular.module('app.chat')
            .config(Config);

// inject dependencies into the config function.
    Config.$inject = ['$routeProvider'];

// define the config function.
    function Config($routeProvider) {
        $routeProvider.when('/chat', {
            controller: 'ChatController',
            controllerAs: 'chat',
            templateUrl: 'chat/chat.html',
            // page displays after data is resolved, no flicker!
            // 'messages' is now available for injection into the controller.
            resolve: {
                messages: Messages
            }
        });
    }

// inject dependencies into the routeProvider resolve function.
    Messages.$inject = ['ChatFactory'];

// define the routeProvider resolve function.
    function Messages(ChatFactory) {
        return ChatFactory.messages();
    }
})();