(function () {
    'use strict';

// add a config to the module.
// https://github.com/johnpapa/angularjs-styleguide#style-y022
// When using a module, avoid using a variable and instead use chaining with the getter syntax.
// without [] this gets the module.
// https://github.com/johnpapa/angularjs-styleguide#style-y024
// Use named functions instead of passing an anonymous function in as a callback.
    angular.module('chat.module')
            .config(Config);

// inject dependencies into the config function.
    Config.$inject = ['$routeProvider'];

// define the config function.
// https://github.com/johnpapa/angularjs-styleguide#style-y030
// Use the 'controllerAs' syntax over the classic controller with $scope syntax.
// https://github.com/johnpapa/angularjs-styleguide#style-y038
// When a controller must be paired with a view and either component may be 
// re-used by other controllers or views, define controllers along with their routes.
    function Config($routeProvider) {
        $routeProvider.when('/chat', {
            controller: 'ChatController',
            controllerAs: 'chat',
            templateUrl: 'app/chat/chat.html',
            // page displays after data is resolved, no flicker!
            // 'messages' is now available for injection into the controller.
            resolve: {
                // See: http://www.johnpapa.net/route-resolve-and-controller-activate-in-angularjs/?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed%3A+JohnPapa+%28JohnPapa.net%29
                messages: Messages
            }
        });
    }

// inject dependencies into the routeProvider resolve function.
// https://github.com/johnpapa/angularjs-styleguide#style-y091
    Messages.$inject = ['chatFactory'];

// define the routeProvider resolve function.
// https://github.com/johnpapa/angularjs-styleguide#style-y092
// https://github.com/johnpapa/angularjs-styleguide#style-y100
    function Messages(chatFactory) {
        return chatFactory.messages();
    }
})();