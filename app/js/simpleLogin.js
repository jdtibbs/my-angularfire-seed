
angular.module('simpleLogin', ['firebase', 'firebase.utils', 'changeEmail'])

  // a simple wrapper on simpleLogin.getUser() that rejects the promise
  // if the user does not exists (i.e. makes user required)
  .factory('requireUser', ['simpleLogin', '$q', function(simpleLogin, $q) {
    return function() {
      return simpleLogin.getUser().then(function (user) {
        return user ? user : $q.reject({ authRequired: true });
      });
    }
  }])

  .factory('simpleLogin', ['$firebaseSimpleLogin', 'fbutil', 'createProfile', 'changeEmail', '$q', '$rootScope',
    function($firebaseSimpleLogin, fbutil, createProfile, changeEmail, $q, $rootScope) {
      var auth = $firebaseSimpleLogin(fbutil.ref());
      var fbref = fbutil.ref();
      var listeners = [];
      
      function statusChange() {
        fns.getUser().then(function(user) {
          fns.user = user || null;
          angular.forEach(listeners, function(fn) {
            fn(user||null);
          });
        });
      }

      var fns = {
        user: null,

        getUser: function() {
          // return auth.$getCurrentUser();
          var deferred = $q.defer();
          var auth = fbref.getAuth();
          if (auth === null){
                deferred.reject('');
            } else {
                deferred.resolve(auth);              
            }
          return deferred.promise;
        },

        /**
         * @param {string} email
         * @param {string} pass
         * @returns {*}
         */
        login: function(email, pass) {
            /*
          return auth.$login('password', {
            email: email,
            password: pass,
            rememberMe: true
          });*/
            var deferred = $q.defer();
            deferred.notify('about to signin.');
            fbref.authWithPassword({'email': email, 'password':pass}, 
            function(error, authData){
                if (error === null){
                    console.log('userId: ' + authData.uid + ' password.email: ' + authData.password.email);
                    deferred.resolve(authData);
                }else{
                    console.log('login error: ' + error);
                    deferred.reject(error);
                }
            });    
            return deferred.promise;
        },

        logout: function() {
          // auth.$logout();
          fbref.unauth();
        },

        createAccount: function(email, pass, name) {
          return auth.$createUser(email, pass)
            .then(function() {
              // authenticate so we have permission to write to Firebase
              return fns.login(email, pass);
            })
            .then(function(user) {
              // store user data in Firebase after creating account
              return createProfile(user.uid, email, name).then(function() {
                return user;
              })
            });
        },

        changePassword: function(email, oldpass, newpass) {
          // return auth.$changePassword(email, oldpass, newpass);
          var def = $q.defer();
          fbref.changePassword({'email' : email, 'oldPassword' : oldpass, 'newPassword' : newpass}, 
            function(error){                 
                if (error === null) {  
                    def.resolve();
                } else {
                    switch (error.code) {
                      case 'INVALID_PASSWORD':
                        // The specified user account password is incorrect.
                        def.reject('invalid password');
                      case 'INVALID_USER':
                        // The specified user account does not exist.
                        def.reject('invalid user');
                      default:
                        def.reject(error);
                    }
                }
            });
            return def.promise;
        },

        changeEmail: function(password, newEmail) {
          return changeEmail(password, fns.user.password.email, newEmail, this);
        },

        removeUser: function(email, pass) {
          // return auth.$removeUser(email, pass);
          var def = $q.defer();
          fbref.removeUser({'email' : email, 'password' : pass}, function(error){
                if (error === null) {  
                    def.resolve();
                } else {
                    switch (error.code) {
                      case 'INVALID_PASSWORD':
                        // The specified user account password is incorrect.
                        def.reject('invalid password');
                      case 'INVALID_USER':
                        // The specified user account does not exist.
                        def.reject('invalid user');
                      default:
                        def.reject(error);
                    }
                }
          });
          return def.promise;
        },

        watch: function(cb, $scope) {
          fns.getUser().then(function(user) {
            cb(user);
          });
          listeners.push(cb);
          var unbind = function() {
            var i = listeners.indexOf(cb);
            if( i > -1 ) { listeners.splice(i, 1); }
          };
          if( $scope ) {
            $scope.$on('$destroy', unbind);
          }
          return unbind;
        }
      };

      $rootScope.$on('$firebaseSimpleLogin:login', statusChange);
      $rootScope.$on('$firebaseSimpleLogin:logout', statusChange);
      $rootScope.$on('$firebaseSimpleLogin:error', statusChange);
      statusChange();

      return fns;
    }])

  .factory('createProfile', ['fbutil', '$q', '$timeout', function(fbutil, $q, $timeout) {
    return function(id, email, name) {
      var ref = fbutil.ref('users', id), def = $q.defer();
      ref.set({email: email, name: name||firstPartOfEmail(email)}, function(err) {
        $timeout(function() {
          if( err ) {
            def.reject(err);
          }
          else {
            def.resolve(ref);
          }
        })
      });

      function firstPartOfEmail(email) {
        return ucfirst(email.substr(0, email.indexOf('@'))||'');
      }

      function ucfirst (str) {
        // credits: http://kevin.vanzonneveld.net
        str += '';
        var f = str.charAt(0).toUpperCase();
        return f + str.substr(1);
      }

      return def.promise;
    }
  }]);
