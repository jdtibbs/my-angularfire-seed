(function () {

    'use strict';

    angular.module('user.module')
            .factory('userValidateFactory', factory);

    factory.$inject = ['$q'];

    function factory($q) {
        var factory = {
            validate: validate
        };

        return factory;

        function validate(user) {
            var def = $q.defer();
            var errors = [];
            if (!user) {
                errors.push('Missing parameter.');
            } else {
                if (!user.name) {
                    errors.push('Name is required.');
                }
                if (!user.businessPhone) {
                    errors.push('Business phone is required.');
                }
            }
            if (errors.length > 0) {
                def.reject(errors);
            } else {
                def.resolve(user);
            }
            return def.promise;
        }
    }

})();