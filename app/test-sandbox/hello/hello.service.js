(function () {
    angular.module('app.hello')
            .factory('service', Service);

    function Service() {
        var service = {
            greeting: function () {
                return 'Hello';
            },
            name: function (name) {
                return name;
            }
        };
        return service;
    }
})();