(function () {
    angular.module('app.hello')
            .controller('controller', Controller);

    Controller.$inject = ['service'];

    function Controller(service) {
        var vm = this;
        vm.hello = hello;
        function hello(name) {
            return service.greeting() + ' ' + service.name(name);
        }
    }
})();