(function () {
    'use strict';

    angular.module('firebase.module')
            .factory('firebaseRunFactory', firebaseRunFactory);

    firebaseRunFactory.$inject = ['FBURL', '$timeout'];

    function firebaseRunFactory(FBURL, $timeout) {
        var factory = {
            verifyConfig: function () {
                if (FBURL.match('//INSTANCE.firebaseio.com')) {
                    angular.element(document.body).html('<h4>Please configure Firebase instance before running!</h4><div><ul><li><h5>See constant FBURL</h5></li></ul></div>');
                    $timeout(function () {
                        angular.element(document.body).removeClass('hide');
                    }, 250);
                }
            }
        };
        return factory;
    }
})();