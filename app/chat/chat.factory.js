(function () {
    'use strict';

// add a service to the module.
// https://github.com/johnpapa/angularjs-styleguide#style-y125
// Use camel-casing for services and factories.
    angular.module('chat.module')
            .factory('chatFactory', chatFactory);

// inject dependencies into the service function.
// https://github.com/johnpapa/angularjs-styleguide#style-y091
    chatFactory.$inject = ['firebaseFactory', 'MESSAGES_URL'];

// define the service function.
// Services: https://github.com/johnpapa/angularjs-styleguide#style-y040
// Factories: https://github.com/johnpapa/angularjs-styleguide#style-y050
// https://github.com/johnpapa/angularjs-styleguide#style-y052
// Expose the callable members of the service (it's interface) at the top, 
// using a technique derived from the Revealing Module Pattern: 
// http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript
    function chatFactory(firebaseFactory, MESSAGES_URL) {
        var factory = {
            messages: messages,
            add: add
        };
        return factory;

        function messages() {
// https://github.com/johnpapa/angularjs-styleguide#style-y061
            return firebaseFactory.syncArray(MESSAGES_URL, {limitToLast: 10, endAt: null});
        }

        function add(message) {
            if (message) {
                messages().$add({text: message});
            }
        }
    }
})();
