'use strict';

angular.module('my.user.factory', ['my.firebase.factory', 'my.login.factory'])

        .factory('userFactory', ['firebaseFactory', 'changeEmailFactory', 'loginFactory', '$q', '$timeout', function (firebaseFactory, changeEmailFactory, loginFactory, $q, $timeout) {
                var INVALID_LOGIN = 'The specified email and or password is incorrect.';
                var fbauth = firebaseFactory.auth();

                var userFactory = {
                    firebaseAuth: function () {
                        return fbauth;
                    },
                    createAccount: function (profile, pass) {
                        return loginFactory.createUser(profile.email, pass)
                                .then(function () {
                                    // authenticate so we have permission to write to Firebase
                                    return userFactory.login(profile.email, pass);
                                })
                                .then(function (user) {
                                    // store user data in Firebase after creating account
                                    return userFactory.createUserProfile(user.uid, profile).then(function () {
                                        return user;
                                    });
                                });
                    },
                    changeEmail: function (password, newEmail) {
                        var def = $q.defer();
                        // TODO is this the only way to nest these calls!?
                        loginFactory.getAuth().then(function (auth) {
                            return auth;
                        }).then(function (auth) {
                            changeEmailFactory.changeEmail(password, auth.password.email, newEmail, userFactory).then(function (auth) {
                                def.resolve(auth);
                            }).catch(function (error) {
                                def.reject(error);
                            });
                        }).catch(function (error) {
                            def.reject(error);
                        });
                        return def.promise;
                    },
                    createUserProfile: function (id, profile) {
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
                        return def.promise;
                    },
                    getUserProfile: function (id) {
                        return firebaseFactory.syncObject(['users', id]);
                    }
                };

                return userFactory;
            }])
        .factory('changeEmailFactory', ['firebaseFactory', '$q', function (firebaseFactory, $q) {
                var changeEmailFactory = {
                    changeEmail: function (password, oldEmail, newEmail, userFactory) {
                        var ctx = {old: {email: oldEmail}, curr: {email: newEmail}};
                        var oldProfile = {};
                        var newProfile = {};

                        // execute activities in order; first we authenticate the user
                        return authOldAccount()
                                // then we fetch old account details
                                .then(loadOldProfile)
                                // then we create a new account, copying old into the new.
                                .then(createNewAccount)
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
                            userFactory.login(ctx.old.email, password)
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
                            return userFactory.createAccount(newProfile, password).then(function (user) {
                                ctx.curr.uid = user.uid;
                                console.log('createNewAccount ctx.curr.uid ' + ctx.curr.uid);
                            });
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
                            return loginFactory.removeUser(ctx.old.email, password);
                            /*
                             var def = $q.defer();
                             userFactory.removeUser(ctx.old.email, password).then(function () {
                             def.resolve();
                             }, function (err) {
                             def.reject(err);
                             });
                             return def.promise;
                             */
                        }

                        function authNewAccount() {
                            return userFactory.login(ctx.curr.email, password);
                        }
                    }};
                return changeEmailFactory;
            }]);

