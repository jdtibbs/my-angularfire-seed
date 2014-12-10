function changeEmail(password, newEmail) {
    var def = $q.defer();
    // get old auth uid.
    var oldUid = loginService.getUid();
    // get old /login object which contains the old email and /user object id.
    var oldLogin = loginService.getLogin(oldUid);
    // validate input parameters.
    if (!newEmail) {
        def.reject('Email is required.');
    } else if (newEmail === oldLogin.email) {
        def.reject('New email must not be same as current email.');
    } else {
        // begin change email...
        // create new firebase user.
        loginService.createUser(newEmail, password)
                .then(function () {
                    // login so we can write to fire base.
                    loginService.login(newEmail, password)
                            .then(function (auth) {
                                // create new /login object
                                loginService.createLogin(auth.uid, newEmail, password)
                                        .then(function (newLogin) {
                                            // successfully created new firebase user and /login object.
                                            // now remove old /login object then old firebase user.
                                            loginService.login(oldLogin.email, password)
                                                    .then(function (auth) {
                                                        loginService.removeLogin(auth.uid)
                                                                .then(function () {
                                                                    loginService.removeUser(auth.uid, password)
                                                                            .then(function () {
                                                                                // success!
                                                                                // log in with new email
                                                                                loginService.login(newEmail, password)
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
