'use strict';

angular.module('chat.factory', [])

        .factory('message', ['fbutil', function (fbutil) {
                return fbutil.syncArray('messages', {limit: 10, endAt: null});
            }]);
