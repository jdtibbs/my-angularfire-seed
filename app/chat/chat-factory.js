'use strict';

angular.module('my.chat.factory', [])

        .factory('message', ['firebaseFactory', function (firebaseFactory) {
                return firebaseFactory.syncArray('messages', {limit: 10, endAt: null});
            }]);
