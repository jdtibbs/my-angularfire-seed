'use strict';
angular.module('my.login.factory', ['my.firebase.factory', 'my.users.factory'])
        .constant('LOGIN_URL', 'login')

        .factory('loginValidator', ['$q',
            function ($q) {
                var validator = {
                    validate: function (login) {
                        var def = $q.defer();
                        var errors = [];
                        if (!login) {
                            errors.push('Missing login parameter.');
                        } else {
                            if (!login || !login.email || login.email.length > 100) {
                                errors.push('Email is required.');
                            }
                            if (!login || !login.users) {
                                errors.push('Users ID is required.');
                            }
                        }
                        if (errors.length > 0) {
                            def.reject(errors);
                        } else {
                            def.resolve(login);
                        }
                        return def.promise;
                    }
                };
                return validator;
            }])

        .factory('loginFirebaseFactory', ['LOGIN_URL', 'loginValidator', 'firebaseFactory', '$q',
            function (LOGIN_URL, loginValidator, firebaseFactory, $q) {
                var firebase = {
                    ref: function (id) {
                        return firebaseFactory.ref(LOGIN_URL, id);
                    },
                    syncObject: function (id) {
                        return firebaseFactory.syncObject([LOGIN_URL, id]);
                    },
                    create: function (email, userId) {
                        return {email: email, users: userId};
                    },
                    add: function (id, login) {
                        var def = $q.defer();
                        if (!id) {
                            def.reject('Id is required.');
                        } else if (!login) {
                            def.reject('Login is required.');
                        } else {
                            loginValidator.validate(login)
                                    .then(function (login) {
                                        var ref = firebaseFactory.ref(LOGIN_URL);
                                        ref.child(id).set(login, function (error) {
                                            if (error) {
                                                def.reject(error);
                                            } else {
                                                def.resolve();
                                            }
                                        });
                                    })
                                    .catch(function (error) {
                                        def.reject(error);
                                    });
                        }
                        return def.promise;
                    }
                };
                return firebase;
            }])

        .factory('loginFactory', ['firebaseFactory', 'loginFirebaseFactory', 'usersFirebaseFactory', '$q', '$log',
            function (firebaseFactory, loginFirebaseFactory, usersFirebaseFactory, $q, $log) {
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
                        var login = loginFirebaseFactory.create(email, users);
                        $log.debug('createLogin: ' + login.email + ' ' + login.users);
                        loginFirebaseFactory.add(auth.uid, login)
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
                                    loginFirebaseFactory.syncObject(uid).$loaded()
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
                        var login = loginFirebaseFactory.ref(authUid);
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
                    }
                };
                return loginFactory;
            }])

        .factory('changeEmailFactory', ['loginFactory', '$q', '$log',
            function (loginFactory, $q, $log) {

                // TODO handle errors, rollback data is error.

//                TODO flip create new user and login, then remove old one?
//                        newUser = function () {
//                            // create new FB user.
//                            // create new login.
//                            // handle errors, backout any changes.
//                            var def = $q.defer();
//                            def.resolve();
//                            return def.promise;
//                        };
//                removeOld = function () {
//                    // remove old login
//                    // remove FB user
//                    // handle errors, backout any changes.
//                    var def = $q.defer();
//                    def.resolve();
//                    return def.promise;
//                };
//                // Execute proposed process...
//                newUser()
//                        .then(function () {
//                            removeOld()
//                                    .then(function () {
//
//                                    })
//                                    .catch(function () {
//                                        // removeOld should handle OK???
//                                    });
//                        })
//                        .catch(function () {
//                            // newUser should handle OK???
//                        });

                var changeEmail = {
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
                            // get old auth uid.
                            loginFactory.getUid()
                                    .then(function (oldUid) {
                                        // get user id.
                                        loginFactory.getLogin(oldUid)
                                                .then(function (login) {
                                                    oldLogin = login;
                                                    if (newEmail === oldLogin.email) {
                                                        def.reject('New email cannot be the same as your current email.');
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
                return changeEmail;
            }]);


