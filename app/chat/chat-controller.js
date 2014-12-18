(function () {
    'use strict';

// add a controller to the module.
// https://github.com/johnpapa/angularjs-styleguide#style-y024
    angular.module('app.chat')
            .controller('ChatController', ChatController);

// inject dependencies into the controller function.
// https://github.com/johnpapa/angularjs-styleguide#style-y091
    ChatController.$inject = ['ChatFactory', 'messages'];

// define the controller function.
    function ChatController(ChatFactory, messages) {
        // https://github.com/johnpapa/angularjs-styleguide#style-y032
        var vm = this;

        // https://github.com/johnpapa/angularjs-styleguide#style-y033
        vm.messages = messages;
        vm.addMessage = addMessage;

        function addMessage(message) {
            ChatFactory.add(message);
        }
    }
})();