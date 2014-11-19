'use strict';

angular.module('my.user.factory', ['my.firebase.factory'])

        .factory('userFactory', ['firebaseFactory', 'changeEmailFactory', '$q', '$timeout', function (firebaseFactory, changeEmailFactory, $q, $timeout) {
                var INVALID_LOGIN = 'The specified email and or password is incorrect.';
                var fbauth = firebaseFactory.auth();

                var factory = {
                    firebaseAuth: function () {
                        return fbauth;
                    },
                    login: function (email, pass) {
                        var def = $q.defer();
                        if (!email) {
                            def.reject('Email is required to login.');
                        } else if (!pass) {
                            def.reject('Password is required to login.');
                        } else {
                            fbauth.$authWithPassword({'email': email, 'password': pass})
                                    .then(function (authData) {
                                        def.resolve(authData);
                                    })
                                    .catch(function (error) {
                                        console.log(error.message);
                                        def.reject(INVALID_LOGIN);
                                    });
                        }
                        return def.promise;
                    },
                    getAuth: function () {
                        var def = $q.defer();
                        var auth = fbauth.$getAuth();
                        if (auth !== null) {
                            def.resolve(auth);
                        } else {
                            def.reject('Not logged in.');
                        }
                        return def.promise;
                    },
                    getUid: function () {
                        var def = $q.defer();
                        factory.getAuth().then(function (auth) {
                            def.resolve(auth.uid);
                        }).catch(function (error) {
                            def.reject(error);
                        });
                        return def.promise;
                    },
                    logout: function () {
                        fbauth.$unauth();
                    },
                    createAccount: function (profile, pass) {
                        return factory.createUser(profile.email, pass)
                                .then(function () {
                                    // authenticate so we have permission to write to Firebase
                                    return factory.login(profile.email, pass);
                                })
                                .then(function (user) {
                                    // store user data in Firebase after creating account
                                    return factory.createUserProfile(user.uid, profile).then(function () {
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
                        var def = $q.defer();
                        // TODO is this the only way to nest these calls!?
                        factory.getAuth().then(function (auth) {
                            return auth;
                        }).then(function (auth) {
                            changeEmailFactory(password, auth.password.email, newEmail, factory).then(function (auth) {
                                def.resolve(auth);
                            }).catch(function (error) {
                                def.reject(error);
                            });
                        }).catch(function (error) {
                            def.reject(error);
                        });
                        return def.promise;
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

                return factory;
            }])
        .factory('changeEmailFactory', ['firebaseFactory', '$q', function (firebaseFactory, $q) {
                return function (password, oldEmail, newEmail, userFactory) {
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
                        var def = $q.defer();
                        userFactory.removeUser(ctx.old.email, password).then(function () {
                            def.resolve();
                        }, function (err) {
                            def.reject(err);
                        });
                        return def.promise;
                    }

                    function authNewAccount() {
                        return userFactory.login(ctx.curr.email, password);
                    }
                };
            }]);

