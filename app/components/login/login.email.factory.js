(function () {

    'use strict';

    angular.module('login.module')
            .factory('loginEmailFactory', factory);

    factory.$inject = ['firebaseAuthFactory', 'loginDaoFactory', '$q', '$log'];

    function factory(firebaseAuthFactory, loginDaoFactory, $q, $log) {
        var factory = {
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
                    firebaseAuthFactory.getUid()
                            .then(function (oldUid) {
                                // get user id.
                                loginDaoFactory.getLogin(oldUid)
                                        .then(function (login) {
                                            oldLogin = login;
                                            if (newEmail === oldLogin.email) {
                                                def.reject('New email cannot be the same as your current email.');
                                            }
                                            // create new firebase user.
                                            firebaseAuthFactory.createUser(newEmail, password)
                                                    .then(function () {
                                                        // login so we can write to fire base.
                                                        $log.debug('created user:' + newEmail);
                                                        firebaseAuthFactory.login(newEmail, password)
                                                                .then(function (auth) {
                                                                    // create new /login object
                                                                    $log.debug('logged in w new email: ' + auth.uid);
                                                                    loginDaoFactory.createLogin(auth, newEmail, oldLogin.users)
                                                                            .then(function (newLogin) {
                                                                                $log.debug('new Login: ' + newLogin);
                                                                                // successfully created new firebase user and /login object.
                                                                                // now remove old /login object then old firebase user.
                                                                                firebaseAuthFactory.login(oldLogin.email, password)
                                                                                        .then(function (auth) {
                                                                                            $log.debug('login w oldEmail: ' + oldLogin.email + ' auth: ' + auth);
                                                                                            loginDaoFactory.removeLogin(auth.uid)
                                                                                                    //yah, did not remove login / simplelogin:45
                                                                                                    .then(function () {
                                                                                                        $log.debug('removed Login' + auth.uid);
                                                                                                        firebaseAuthFactory.removeUser(auth.uid, password)
                                                                                                                .then(function () {
                                                                                                                    $log.debug('removed fb user.');
                                                                                                                    // success!
                                                                                                                    // log in with new email
                                                                                                                    firebaseAuthFactory.login(newEmail, password)
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
        return factory;
    }
})();