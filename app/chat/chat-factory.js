'use strict';

angular.module('my.chat.factory', [])

        .factory('message', ['fbutil', function (fbutil) {
                return fbutil.syncArray('messages', {limit: 10, endAt: null});
            }]);
