'use strict';
angular.module('my.login.factory', ['my.firebase.factory', 'my.login.firebase.service', 'my.users.firebase.factory'])

        .factory('loginFactory', ['firebaseFactory', 'loginFirebaseService', 'usersFirebaseFactory', '$q', '$log',
            function (firebaseFactory, loginFirebaseService, usersFirebaseFactory, $q, $log) {
                var INVALID_CREDENTIALS = 'The email and or password is incorrect.';

                var loginFactory = {
                    login: function (email, pass) {
                        var def = $q.defer();
                        if (!email) {
                            def.reject('Email is required to login.');
                        } else if (!pass) {
                            def.reject('Password is required to login.');
                        } else {
                            firebaseFactory.auth().$authWithPassword({'email': email, 'password': pass})
                                    .then(function (authData) {
                                        def.resolve(authData);
                                    })
                                    .catch(function (error) {
                                        $log.error(error.message);
                                        def.reject(INVALID_CREDENTIALS);
                                    });
                        }
                        return def.promise;
                    },
                    logout: function () {
                        firebaseFactory.auth().$unauth();
                    },
                    getAuth: function () {
                        var def = $q.defer();
                        var auth = firebaseFactory.auth().$getAuth();
                        if (auth !== null) {
                            def.resolve(auth);
                        } else {
                            def.reject('Not logged in.');
                        }
                        return def.promise;
                    },
                    getUid: function () {
                        var def = $q.defer();
                        loginFactory.getAuth().then(function (auth) {
                            $log.debug('auth.uid: ' + auth.uid);
                            def.resolve(auth.uid);
                        }).catch(function (error) {
                            def.reject(error);
                        });
                        return def.promise;
                    },
                    register: function (profile, email, password) {
                        var def = $q.defer();
                        loginFactory.createUser(email, password)
                                .then(function () {
                                    loginFactory.login(email, password)
                                            .then(function (auth) {
                                                usersFirebaseFactory.add(profile)
                                                        .then(function (profileRef) {
                                                            loginFactory.createLogin(auth, email, profileRef.key())
                                                                    .then(function (loginRef) {
                                                                        var x = {id: 'x'};
                                                                        console.log(x.fred());
                                                                        def.resolve(loginRef);
                                                                    })
                                                                    .catch(function (error) {
                                                                        //TODO back out data.
                                                                        def.reject(error);
                                                                    });
                                                        })
                                                        .catch(function (error) {
                                                            //TODO back out data.
                                                            def.reject(error);
                                                        });
                                            })
                                            .catch(function (error) {
                                                //TODO back out data.
                                                def.reject(error);
                                            });
                                })
                                .catch(function (error) {
                                    def.reject(error);
                                });
                        return def.promise;
                    },
                    createUser: function (email, pass) {
                        var def = $q.defer();
                        firebaseFactory.auth().$createUser(email, pass)
                                .then(function () {
                                    def.resolve();
                                })
                                .catch(function (error) {
                                    $log.error(error);
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
                    createLogin: function (auth, email, users) {
                        var def = $q.defer();
                        var login = loginFirebaseService.create(email, users);
                        $log.debug('createLogin: ' + login.email + ' ' + login.users);
                        loginFirebaseService.add(auth.uid, login)
                                .then(function () {
                                    $log.debug('Login created');
                                    def.resolve();
                                })
                                .catch(function (error) {
                                    def.reject(error);
                                });
                        return def.promise;
                    },
                    getLogin: function () {
                        var def = $q.defer();
                        loginFactory.getUid()
                                .then(function (uid) {
                                    loginFirebaseService.syncObject(uid).$loaded()
                                            .then(function (login) {
                                                def.resolve(login);
                                            });
                                })
                                .catch(function (error) {
                                    def.reject(error);
                                });
                        return def.promise;
                    },
                    removeUser: function (email, pass) {
                        var def = $q.defer();
                        firebaseFactory.auth().$removeUser(email, pass)
                                .then(function () {
                                    def.resolve();
                                })
                                .catch(function (error) {
                                    console.log('Error-removeUser: ' + error);
                                    switch (error.code) {
                                        case 'INVALID_PASSWORD':
                                            def.reject(INVALID_CREDENTIALS);
                                        case 'INVALID_USER':
                                            def.reject(INVALID_CREDENTIALS);
                                        default:
                                            def.reject(error);
                                    }
                                });
                        return def.promise;
                    },
                    removeLogin: function (authUid) {
                        var def = $q.defer();
                        var login = loginFirebaseService.ref(authUid);
                        login.remove(function (error) {
                            if (error) {
                                def.reject(error);
                            } else {
                                def.resolve();
                            }
                        });
                        return def.promise;
                    },
                    changePassword: function (email, oldpass, newpass) {
                        var def = $q.defer();
                        firebaseFactory.auth().$changePassword(email, oldpass, newpass)
                                .then(function () {
                                    def.resolve();
                                })
                                .catch(function (error) {
                                    console.log('Error-changePassword: ' + error);
                                    switch (error.code) {
                                        case 'INVALID_PASSWORD':
                                            def.reject(INVALID_CREDENTIALS);
                                        case 'INVALID_USER':
                                            def.reject(INVALID_CREDENTIALS);
                                        default:
                                            def.reject(error);
                                    }
                                });
                        return def.promise;
                    },
                    changeEmail: function (newEmail, password) {
                        var def = $q.defer();
                        // validate input parameters.
                        if (!newEmail) {
                            def.reject('Email is required.');
                            // find below, validate that new email is different then current.
                        }
                        else if (!password) {
                            def.reject('Password is required.');
                        } else {
                            // begin change email...
                            var oldLogin = {};
                            //  // get old auth uid.
                            loginFactory.getUid()
                                    .then(function (oldUid) {
                                        $log.debug('oldUid: ' + oldUid);
                                        // get old /login object which contains the old email and /user object id.
                                        loginFactory.getLogin(oldUid)
                                                .then(function (login) {
                                                    $log.debug('oldLogin: ' + login);
                                                    oldLogin = login;
                                                    if (newEmail === oldLogin.email) {
                                                        def.reject('New email must not be same as current email.');
                                                    }
                                                    // create new firebase user.
                                                    loginFactory.createUser(newEmail, password)
                                                            .then(function () {
                                                                // login so we can write to fire base.
                                                                $log.debug('created user:' + newEmail);
                                                                loginFactory.login(newEmail, password)
                                                                        .then(function (auth) {
                                                                            // create new /login object
                                                                            $log.debug('logged in w new email: ' + auth.uid);
                                                                            loginFactory.createLogin(auth, newEmail, oldLogin.users)
                                                                                    .then(function (newLogin) {
                                                                                        $log.debug('new Login: ' + newLogin);
                                                                                        // successfully created new firebase user and /login object.
                                                                                        // now remove old /login object then old firebase user.
                                                                                        loginFactory.login(oldLogin.email, password)
                                                                                                .then(function (auth) {
                                                                                                    $log.debug('login w oldEmail: ' + oldLogin.email + ' auth: ' + auth);
                                                                                                    loginFactory.removeLogin(auth.uid)
                                                                                                            //yah, did not remove login / simplelogin:45
                                                                                                            .then(function () {
                                                                                                                $log.debug('removed Login' + auth.uid);
                                                                                                                loginFactory.removeUser(auth.uid, password)
                                                                                                                        .then(function () {
                                                                                                                            $log.debug('removed fb user.');
                                                                                                                            // success!
                                                                                                                            // log in with new email
                                                                                                                            loginFactory.login(newEmail, password)
                                                                                                                                    .then(function (auth) {
                                                                                                                                        $log.debug('login w new email: ' + auth.uid);
                                                                                                                                        def.resolve(auth);
                                                                                                                                    });
                                                                                                                        });
                                                                                                            });
                                                                                                });
                                                                                    });
                                                                        });
                                                            })
                                                            .catch(function (error) {
                                                                $log.error(error);
                                                                def.reject(error);
                                                            });
                                                });
                                    });
                        }
                        return def.promise;
                    }
                };
                return loginFactory;
            }]);


