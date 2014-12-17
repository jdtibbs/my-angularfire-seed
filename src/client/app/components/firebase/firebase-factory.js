'use strict';

// a simple wrapper on Firebase and AngularFire to simplify deps and keep things DRY
angular.module('my.firebase.factory', ['firebase', 'my.config'])
        .factory('firebaseFactory', ['$window', 'FBURL', '$firebase', '$firebaseAuth', '$q',
            function ($window, FBURL, $firebase, $firebaseAuth, $q) {

                var factory = {
                    ref: firebaseRef,
                    syncObject: function (path, factoryConfig) {
                        return syncData.apply(null, arguments).$asObject();
                    },
                    syncArray: function (path, factoryConfig) {
                        return syncData.apply(null, arguments).$asArray();
                    },
                    auth: function () {
                        return $firebaseAuth(this.ref());
                    },
                    add: function (path, object, validate) {
                        return validate(object)
                                .then(function (object) {
                                    var def = $q.defer();
                                    factory.syncArray(path).$add(object)
                                            .then(function (ref) {
                                                def.resolve(ref);
                                            })
                                            .catch(function (error) {
                                                def.reject(error);
                                            });
                                    return def.promise;
                                });
                    },
                    save: function (object, validate) {
                        return validate(object)
                                .then(function (object) {
                                    var def = $q.defer();
                                    object.$save()
                                            .then(function (ref) {
                                                def.resolve(ref);
                                            })
                                            .catch(function (error) {
                                                def.reject(error);
                                            });
                                    return def.promise;
                                });
                    },
                    delete: function (path) {
                        var def = $q.defer();
                        factory.ref(path)
                                .remove(function (error) {
                                    if (error) {
                                        def.reject(error);
                                    } else {
                                        def.resolve();
                                    }
                                });
                        return def.promise;
                    }
                };

                return factory;

                function pathRef(args) {
                    for (var i = 0; i < args.length; i++) {
                        if (angular.isArray(args[i])) {
                            args[i] = pathRef(args[i]);
                        }
                        else if (typeof args[i] !== 'string') {
                            throw new Error('Argument ' + i + ' to firebaseRef is not a string: ' + args[i]);
                        }
                    }
                    return args.join('/');
                }

                /**
                 * Example:
                 * <code>
                 *    function(firebaseRef) {
                 *       var ref = firebaseRef('path/to/data');
                 *    }
                 * </code>
                 *
                 * @function
                 * @name firebaseRef
                 * @param {String|Array...} path relative path to the root folder in Firebase instance
                 * @return a Firebase instance
                 */
                function firebaseRef(path) {
                    var ref = new $window.Firebase(FBURL);
                    var args = Array.prototype.slice.call(arguments);
                    if (args.length) {
                        ref = ref.child(pathRef(args));
                    }
                    return ref;
                }

                /**
                 * Create a $firebase reference with just a relative path. For example:
                 *
                 * <code>
                 * function(syncData) {
                 *    // a regular $firebase ref
                 *    $scope.widget = syncData('widgets/alpha');
                 *
                 *    // or automatic 3-way binding
                 *    syncData('widgets/alpha').$bind($scope, 'widget');
                 * }
                 * </code>
                 *
                 * Props is the second param passed into $firebase. It can also contain limit, startAt, endAt,
                 * and they will be applied to the ref before passing into $firebase
                 *
                 * @function
                 * @name syncData
                 * @param {String|Array...} path relative path to the root folder in Firebase instance
                 * @param {object} [props]
                 * @return a Firebase instance
                 */
                function syncData(path, props) {
                    var ref = firebaseRef(path);
                    props = angular.extend({}, props);
                    angular.forEach(['orderByChild', 'equalTo', 'limitToLast', 'startAt', 'endAt'], function (k) {
                        if (props.hasOwnProperty(k)) {
                            var v = props[k];
                            ref = ref[k].apply(ref, angular.isArray(v) ? v : [v]);
                            delete props[k];
                        }
                    });
                    return $firebase(ref, props);
                }
            }]);

