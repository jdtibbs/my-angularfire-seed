'use strict';
angular.module('my.firebase.service', ['firebase', 'my.config'])
        .service('firebaseService', ['FBURL', '$firebase', '$firebaseAuth',
            function (FBURL, $firebase, $firebaseAuth) {

                var service = {
                    ref: function (path) {
                        if (path) {
                            return new $firebase(FBURL + '/' + path);
                        } else {
                            return new $firebase(FBURL);
                        }
                    },
                    sync: function (path) {
                        return $firebase(this.ref(path));
                    },
                    asArray: function (path) {
                        return this.sync(path).$asArray();
                    },
                    asObject: function (path) {
                        return this.sync(path).$asObject();
                    },
                    auth: function () {
                        return $firebaseAuth(this.ref());
                    }
                };
                return service;
            }]);