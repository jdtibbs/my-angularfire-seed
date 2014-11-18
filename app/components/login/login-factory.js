'use strict';
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
                    login: function (email, pass) {
                        var def = $q.defer();
                        if (!email) {
                            $rootScope.$broadcast('login:error', null);
                            def.reject('Email is required to login.');
                        } else if (!pass) {
                            $rootScope.$broadcast('login:error', null);
                            def.reject('Password is required to login.');
                        } else {
                            fbauth.$authWithPassword({'email': email, 'password': pass})
                                    .then(function (authData) {
                                        $rootScope.$broadcast('login:login', authData);
                                        def.resolve(authData);
                                    })
                                    .catch(function (error) {
                                        console.log(error.message);
                                        $rootScope.$broadcast('login:error', null);
                                        def.reject(INVALID_LOGIN);
                                    });
                        }
                        return def.promise;
                    },
                    logout: function () {
                        fbauth.$unauth();
                        $rootScope.$broadcast('login:logout', null);
                    },
                    createAccount: function (profile, pass) {
                        return fns.createUser(profile.email, pass)
                                .then(function () {
                                    // authenticate so we have permission to write to Firebase
                                    return fns.login(profile.email, pass);
                                })
                                .then(function (user) {
                                    // store user data in Firebase after creating account
                                    return userFactory.createProfile(user.uid, profile).then(function () {
                                        return user;
                                    });
                                });
                    },
                    createUser: function (email, pass) {
                        var def = $q.defer();
                        fbauth.$createUser(email, pass)
                                .then(function () {
                                    def.resolve();
                                })
                                .catch(function (error) {
                                    console.log('Error-createUser: ' + error);
                                    switch (error.code) {
                                        case 'EMAIL_TAKEN':
                                            def.reject('The new user account cannot be created because the email is already in use.');
                                        case 'INVALID_EMAIL':
                                            def.reject('The specified email is not a valid email.');
                                        default:
                                            def.reject(error);
                                    }
                                });
                        return def.promise;
                    },
                    changePassword: function (email, oldpass, newpass) {
                        var def = $q.defer();
                        //fbauth.$changePassword({email: email, oldPassword: oldpass, newPassword: newpass})
                        fbauth.$changePassword(email, oldpass, newpass)
                                .then(function () {
                                    def.resolve();
                                })
                                .catch(function (error) {
                                    console.log('Error-changePassword: ' + error);
                                    switch (error.code) {
                                        case 'INVALID_PASSWORD':
                                            def.reject(INVALID_LOGIN);
                                        case 'INVALID_USER':
                                            def.reject(INVALID_LOGIN);
                                        default:
                                            def.reject(error);
                                    }
                                    // def.reject(error)
                                });
                        return def.promise;
                    },
                    changeEmail: function (password, newEmail) {
                        return changeEmailFactory(password, fns.user.password.email, newEmail, this);
                    },
                    removeUser: function (email, pass) {
                        var def = $q.defer();
                        fbauth.$removeUser(email, pass)
                                .then(function () {
                                    def.resolve();
                                })
                                .catch(function (error) {
                                    console.log('Error-removeUser: ' + error);
                                    switch (error.code) {
                                        case 'INVALID_PASSWORD':
                                            def.reject(INVALID_LOGIN);
                                        case 'INVALID_USER':
                                            def.reject(INVALID_LOGIN);
                                        default:
                                            def.reject(error);
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
                    var oldProfile = {};
                    var newProfile = {};
                    // execute activities in order; first we authenticate the user
                    return authOldAccount()
                            // then we fetch old account details
                            .then(loadOldProfile)
                            // then we create a new account
                            .then(createNewAccount)
                            // then we copy old account info
                            //.then(copyProfile) this is done in createNewAccount!!!
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
                        // return 
                        var def = $q.defer();
                        loginFactory.login(ctx.old.email, password)
                                .then(function (user) {
                                    ctx.old.uid = user.uid;
                                    console.log('authOldAccount ctx.old.uid ' + ctx.old.uid);
                                    def.resolve();
                                })
                                .catch(function (err) {
                                    console.error('authOldAccount ' + err);
                                    def.reject(err);
                                });
                        return def.promise;
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
                                        oldProfile = dat;
                                        def.resolve();
                                    }
                                },
                                function (err) {
                                    def.reject(err);
                                });
                        return def.promise;
                    }

                    function createNewAccount() {
                        newProfile = oldProfile;
                        newProfile.email = ctx.curr.email;
                        return loginFactory.createAccount(newProfile, password).then(function (user) {
                            ctx.curr.uid = user.uid;
                            console.log('createNewAccount ctx.curr.uid ' + ctx.curr.uid);
                        });
                    }

                    function copyProfile() {
                        // not used anymore since adding user profile properties.
                        var d = $q.defer();
                        ctx.curr.ref = firebaseFactory.ref('users', ctx.curr.uid);
                        newProfile = oldProfile;
                        newProfile.email = ctx.email;
                        ctx.curr.ref.set(newProfile, function (err) {
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
