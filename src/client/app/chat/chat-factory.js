'use strict';

angular.module('my.chat.factory', [])

        .factory('message', ['firebaseFactory', function (firebaseFactory) {
                return firebaseFactory.syncArray('messages', {limitToLast: 10, endAt: null});
            }]);
