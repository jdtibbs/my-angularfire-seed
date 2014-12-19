(function () {
    'use strict';

// add a controller to the module.
// https://github.com/johnpapa/angularjs-styleguide#style-y024
// https://github.com/johnpapa/angularjs-styleguide#style-y123
// Use UpperCamelCase for controllers, as they are constructors.
    angular.module('chat.module')
            .controller('ChatController', ChatController);

// inject dependencies into the controller function.
// https://github.com/johnpapa/angularjs-styleguide#style-y091
// https://github.com/johnpapa/angularjs-styleguide#style-y100
    ChatController.$inject = ['chatFactory', 'messages'];

// define the controller function.
    function ChatController(chatFactory, messages) {
// https://github.com/johnpapa/angularjs-styleguide#style-y032
// Use a capture variable for this when using the controllerAs syntax. 
// Choose a consistent variable name such as vm, which stands for ViewModel.
        var vm = this;

// https://github.com/johnpapa/angularjs-styleguide#style-y033
// Place bindable members at the top of the controller, 
// alphabetized, and not spread through the controller code.
// https://github.com/johnpapa/angularjs-styleguide#style-y080
// https://github.com/johnpapa/angularjs-styleguide#style-y081

        vm.messages = messages;
        vm.addMessage = addMessage;

// https://github.com/johnpapa/angularjs-styleguide#style-y034
// place bindable functions below bindable members.
        function addMessage(message) {
// https://github.com/johnpapa/angularjs-styleguide#style-y110
// see: components/exception/exception-decorator.js
            // message.foo();
            // TODO handle errors with exception.blocks.js
// https://github.com/johnpapa/angularjs-styleguide#style-y111
// Create a factory that exposes an interface to catch and gracefully handle exceptions.
//             
// https://github.com/johnpapa/angularjs-styleguide#style-y035
// Defer logic in a controller by delegating to services and factories.
            chatFactory.add(message);
        }
    }
})();