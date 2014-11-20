'use strict';

// TODO deprecated by moving logic to user-factory.js

angular.module('my.login.factory', ['my.firebase.factory', 'my.user.factory'])

        // a simple wrapper on simpleLogin.getUser() that rejects the promise
        // if the user does not exists (i.e. makes user required)
        .factory('loginRequireUserFactory', ['loginFactory', '$q', function (loginFactory, $q) {
                return function () {
                    return loginFactory.getUser().then(function (user) {
                        return user ? user : $q.reject({authRequired: true});
                    });
                };
            }])

        .factory('loginFactory', ['firebaseFactory', 'userFactory', 'changeEmailFactory', '$q', '$rootScope',
            function (firebaseFactory, userFactory, changeEmailFactory, $q, $rootScope) {
                var INVALID_LOGIN = 'The specified email and or password is incorrect.';
                var fbauth = firebaseFactory.auth();
                var listeners = [];
                function statusChange() {
                    fns.getUser().then(function (user) {
                        fns.user = user || null;
                        angular.forEach(listeners, function (fn) {
                            fn(user || null);
                        });
                    });
                }

                var fns = {
                    user: null,
                    getUser: function () {
                        var deferred = $q.defer();
                        deferred.resolve(fbauth.$getAuth());
                        return deferred.promise;
                    },
                    /**
                     * @param {string} email
                     * @param {string} pass
                     * @returns {*}
                     */
                    watch: function (cb, $scope) {
                        fns.getUser().then(function (user) {
                            cb(user);
                        });
                        listeners.push(cb);
                        var unbind = function () {
                            var i = listeners.indexOf(cb);
                            if (i > -1) {
                                listeners.splice(i, 1);
                            }
                        };
                        if ($scope) {
                            $scope.$on('$destroy', unbind);
                        }
                        return unbind;
                    }
                };
                $rootScope.$on('login:login', statusChange);
                $rootScope.$on('login:logout', statusChange);
                $rootScope.$on('login:error', statusChange);
                statusChange();
                return fns;
            }])


;
