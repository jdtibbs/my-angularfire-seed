(function () {
    'use strict';

// add a service to the module.
    angular.module('app.chat')
            .constant('MESSAGES_URL', 'messages')
            .factory('ChatFactory', ChatFactory);

// inject dependencies into the service function.
    ChatFactory.$inject = ['firebaseFactory', 'MESSAGES_URL'];

// define the service function.
    function ChatFactory(firebaseFactory, MESSAGES_URL) {
        var factory = {
            add: function (message) {
                if (message) {
                    factory.messages().$add({text: message});
                }
            },
            messages: function () {
                return firebaseFactory.syncArray(MESSAGES_URL, {limitToLast: 10, endAt: null});
            }
        };
        return factory;
    }
})();
