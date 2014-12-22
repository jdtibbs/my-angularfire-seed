'use strict';

angular.module('directives.module')

        /**
         * A directive that shows elements only when user is logged out.
         *
        .directive('ngHideAuth', ['loginFactory', '$timeout', function (loginFactory, $timeout) {
                var isLoggedIn;
                loginFactory.watch(function (user) {
                    isLoggedIn = !!user;
                });

                return {
                    restrict: 'A',
                    link: function (scope, el) {
                        function update() {
                            el.addClass('ng-cloak'); // hide until we process it

                            // sometimes if ngCloak exists on same element, they argue, so make sure that
                            // this one always runs last for reliability
                            $timeout(function () {
                                el.toggleClass('ng-cloak', isLoggedIn !== false);
                            }, 0);
                        }

                        update();
                        loginFactory.watch(update, scope);
                    }
                };
            }]);
*/