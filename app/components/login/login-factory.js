'use strict';

angular.module('my.login.factory', ['firebase', 'my.firebase.factory', 'my.user.factory'])

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
                var fbref = firebaseFactory.ref();
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
                        deferred.resolve(fbref.getAuth());
                        return deferred.promise;
                    },
                    /**
                     * @param {string} email
                     * @param {string} pass
                     * @returns {*}
                     */
                    login: function (email, pass) {
                        var deferred = $q.defer();
                        deferred.notify('about to signin.');
                        fbref.authWithPassword({'email': email, 'password': pass},
                        function (error, authData) {
                            if (error === null) {
                                console.log('userId: ' + authData.uid + ' password.email: ' + authData.password.email);
                                $rootScope.$broadcast('login:login', authData);
                                deferred.resolve(authData);
                            } else {
                                console.log('login error: ' + error);
                                $rootScope.$broadcast('login:error', null);
                                deferred.reject(error);
                            }
                        });
                        return deferred.promise;
                    },
                    logout: function () {
                        fbref.unauth();
                        $rootScope.$broadcast('login:logout', null);
                    },
                    createAccount: function (email, pass, name) {
                        return fns.createUser(email, pass)
                                .then(function () {
                                    // authenticate so we have permission to write to Firebase
                                    return fns.login(email, pass);
                                })
                                .then(function (user) {
                                    // store user data in Firebase after creating account
                                    return userFactory.createProfile(user.uid, email, name).then(function () {
                                        return user;
                                    });
                                });
                    },
                    createUser: function (email, pass) {
                        var def = $q.defer();
                        fbref.createUser({'email': email, 'password': pass},
                        function (error) {
                            if (error) {
                                switch (error.code) {
                                    case 'EMAIL_TAKEN':
                                        def.reject('The new user account cannot be created because the email is already in use.');
                                    case 'INVALID_EMAIL':
                                        def.reject('The specified email is not a valid email.');
                                    default:
                                        def.reject(error)
                                }
                            } else {
                                // User account created successfully!
                                def.resolve();
                            }
                        });
                        return def.promise;
                    },
                    changePassword: function (email, oldpass, newpass) {
                        var def = $q.defer();
                        fbref.changePassword({'email': email, 'oldPassword': oldpass, 'newPassword': newpass},
                        function (error) {
                            if (error === null) {
                                def.resolve();
                            } else {
                                switch (error.code) {
                                    case 'INVALID_PASSWORD':
                                        // The specified user account password is incorrect.
                                        def.reject('invalid password');
                                    case 'INVALID_USER':
                                        // The specified user account does not exist.
                                        def.reject('invalid user');
                                    default:
                                        def.reject(error);
                                }
                            }
                        });
                        return def.promise;
                    },
                    changeEmail: function (password, newEmail) {
                        return changeEmailFactory(password, fns.user.password.email, newEmail, this);
                    },
                    removeUser: function (email, pass) {
                        var def = $q.defer();
                        fbref.removeUser({'email': email, 'password': pass}, function (error) {
                            if (error === null) {
                                def.resolve();
                            } else {
                                switch (error.code) {
                                    case 'INVALID_PASSWORD':
                                        // The specified user account password is incorrect.
                                        def.reject('invalid password');
                                    case 'INVALID_USER':
                                        // The specified user account does not exist.
                                        def.reject('invalid user');
                                    default:
                                        def.reject(error);
                                }
                            }
                        });
                        return def.promise;
                    },
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

        .factory('changeEmailFactory', ['firebaseFactory', '$q', function (firebaseFactory, $q) {
                return function (password, oldEmail, newEmail, loginFactory) {
                    var ctx = {old: {email: oldEmail}, curr: {email: newEmail}};

                    // execute activities in order; first we authenticate the user
                    return authOldAccount()
                            // then we fetch old account details
                            .then(loadOldProfile)
                            // then we create a new account
                            .then(createNewAccount)
                            // then we copy old account info
                            .then(copyProfile)
                            // and once they safely exist, then we can delete the old ones
                            // we have to authenticate as the old user again
                            .then(authOldAccount)
                            .then(removeOldProfile)
                            .then(removeOldLogin)
                            // and now authenticate as the new user
                            .then(authNewAccount)
                            .catch(function (err) {
                                console.error(err);
                                return $q.reject(err);
                            });

                    function authOldAccount() {
                        return loginFactory.login(ctx.old.email, password).then(function (user) {
                            ctx.old.uid = user.uid;
                        });
                    }

                    function loadOldProfile() {
                        var def = $q.defer();
                        ctx.old.ref = firebaseFactory.ref('users', ctx.old.uid);
                        ctx.old.ref.once('value',
                                function (snap) {
                                    var dat = snap.val();
                                    if (dat === null) {
                                        def.reject(oldEmail + ' not found');
                                    }
                                    else {
                                        ctx.old.name = dat.name;
                                        def.resolve();
                                    }
                                },
                                function (err) {
                                    def.reject(err);
                                });
                        return def.promise;
                    }

                    function createNewAccount() {
                        return loginFactory.createAccount(ctx.curr.email, password, ctx.old.name).then(function (user) {
                            ctx.curr.uid = user.uid;
                        });
                    }

                    function copyProfile() {
                        var d = $q.defer();
                        ctx.curr.ref = firebaseFactory.ref('users', ctx.curr.uid);
                        var profile = {email: ctx.curr.email, name: ctx.old.name || ''};
                        ctx.curr.ref.set(profile, function (err) {
                            if (err) {
                                d.reject(err);
                            } else {
                                d.resolve();
                            }
                        });
                        return d.promise;
                    }

                    function removeOldProfile() {
                        var d = $q.defer();
                        ctx.old.ref.remove(function (err) {
                            if (err) {
                                d.reject(err);
                            } else {
                                d.resolve();
                            }
                        });
                        return d.promise;
                    }

                    function removeOldLogin() {
                        var def = $q.defer();
                        loginFactory.removeUser(ctx.old.email, password).then(function () {
                            def.resolve();
                        }, function (err) {
                            def.reject(err);
                        });
                        return def.promise;
                    }

                    function authNewAccount() {
                        return loginFactory.login(ctx.curr.email, password);
                    }
                };
            }]);
;
