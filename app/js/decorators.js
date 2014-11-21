/**
 * Wraps ng-cloak so that, instead of simply waiting for Angular to compile, it waits until
 * loginFactory resolves with the remote Firebase services.
 *
 * <code>
 *    <div ng-cloak>Authentication has resolved.</div>
 * </code>
 */
angular.module('my.decorators', ['my.firebase.factory'])
        .config(['$provide', function ($provide) {
                // adapt ng-cloak to wait for auth before it does its magic
                $provide.decorator('ngCloakDirective', ['$delegate', 'firebaseFactory',
                    function ($delegate, firebaseFactory) {
                        var directive = $delegate[0];
                        // make a copy of the old directive
                        var _compile = directive.compile;
                        directive.compile = function (element, attr) {
                            firebaseFactory.auth().$waitForAuth().then(function () {
                                // after auth, run the original ng-cloak directive
                                _compile.call(directive, element, attr);
                            });
                        };
                        // return the modified directive
                        return $delegate;
                    }]);
            }]);