'use strict';

angular.module('my.user.factory', ['firebase', 'my.firebase.factory'])

        .factory('userFactory', ['firebaseFactory', '$q', '$timeout', function (firebaseFactory, $q, $timeout) {
                var ns = {
                    createProfile: function (id, profile) {
                        var ref = firebaseFactory.ref('users', id);
                        var def = $q.defer();
                        // !! set() overwrites existing data.
                        ref.set(profile, function (err) {
                            $timeout(function () {
                                if (err) {
                                    def.reject(err);
                                }
                                else {
                                    def.resolve(ref);
                                }
                            });
                        });

                        function firstPartOfEmail(email) {
                            return ucfirst(email.substr(0, email.indexOf('@')) || '');
                        }

                        function ucfirst(str) {
                            // credits: http://kevin.vanzonneveld.net
                            str += '';
                            var f = str.charAt(0).toUpperCase();
                            return f + str.substr(1);
                        }
                        return def.promise;
                    },
                    
                    getProfile: function (id) {
                        return firebaseFactory.syncObject(['users', id]);
                    }
                };
                
                return ns;
            }]);
