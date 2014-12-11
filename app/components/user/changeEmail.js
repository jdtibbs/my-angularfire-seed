function changeEmail(password, newEmail) {
    var def = $q.defer();
    // get old auth uid.
    var oldUid = loginFactory.getUid();
    // get old /login object which contains the old email and /user object id.
    var oldLogin = loginFactory.getLogin(oldUid);
    // validate input parameters.
    if (!newEmail) {
        def.reject('Email is required.');
    } else if (newEmail === oldLogin.email) {
        def.reject('New email must not be same as current email.');
    } else {
        // begin change email...
        // create new firebase user.
        loginFactory.createUser(newEmail, password)
                .then(function () {
                    // login so we can write to fire base.
                    loginFactory.login(newEmail, password)
                            .then(function (auth) {
                                // create new /login object
                                loginFactory.createLogin(auth.uid, newEmail, password)
                                        .then(function (newLogin) {
                                            // successfully created new firebase user and /login object.
                                            // now remove old /login object then old firebase user.
                                            loginFactory.login(oldLogin.email, password)
                                                    .then(function (auth) {
                                                        loginFactory.removeLogin(auth.uid)
                                                                .then(function () {
                                                                    loginFactory.removeUser(auth.uid, password)
                                                                            .then(function () {
                                                                                // success!
                                                                                // log in with new email
                                                                                loginFactory.login(newEmail, password)
                                                                                        .then(function (auth) {
                                                                                            def.resolve();
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
    }
    return def.promise;
}
