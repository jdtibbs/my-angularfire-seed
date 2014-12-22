(function () {
    angular.module('user.module')
            .factory('userDaoFactory', factory);

    factory.$inject = ['firebaseFactory', 'USERS_URL', 'userValidateFactory'];

    function factory(firebaseFactory, USERS_URL, userValidateFactory) {
        var factory = {
            syncArray: function () {
                return firebaseFactory.syncArray(USERS_URL);
            },
            syncObject: function (id) {
                return firebaseFactory.syncObject([USERS_URL, id]);
            },
            add: function (user) {
                return firebaseFactory.add(USERS_URL, user, userValidateFactory.validate);
            },
            save: function (user) {
                return firebaseFactory.save(user, userValidateFactory.validate);
            }
        };
        return factory;
    }
})();