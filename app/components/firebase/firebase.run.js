(function () {
    'use strict';

// https://github.com/johnpapa/angularjs-styleguide#style-y171

    angular.module('firebase.module')
            .run(config);

    config.$inject = ['firebaseRunFactory'];

    function config(firebaseRunFactory) {
        firebaseRunFactory.verifyConfig();
    }
})();