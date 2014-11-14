'use strict';

angular.module('my.account.factory', ['firebase', 'firebase.utils', 'changeEmail'])

        .factory('createProfile', ['fbutil', '$q', '$timeout', function (fbutil, $q, $timeout) {
                return function (id, email, name) {
                    var ref = fbutil.ref('users', id), def = $q.defer();
                    ref.set({email: email, name: name || firstPartOfEmail(email)}, function (err) {
                        $timeout(function () {
                            if (err) {
                                def.reject(err);
                            }
                            else {
                                def.resolve(ref);
                            }
                        })
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
                };
            }]);
