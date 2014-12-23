(function () {

    'use strict';

    angular.module('login.module')
            .factory('loginValidateFactory', factory);

    factory.$inject = ['$q'];

    function factory($q) {
        var factory = {
            validate: validate
        };

        return factory;

        function validate(login) {
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
    }

})();