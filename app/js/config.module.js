'use strict';

// Declare app level module which depends on filters, and services
angular.module('config.module', [])

        // version of this seed app is compatible with angularFire 0.6
        // see tags for other versions: https://github.com/firebase/angularFire-seed/tags
        .constant('seed.version', '0.8.2')
        // jdtibbs: version x.y.z
        // Where:
        // x = main version number, 1-~.
        // y = feature number, 0-9. Increase this number if the change contains new features with or without bug fixes.
        // z = hotfix number, 0-~. Increase this number if the change only contains bug fixes.
        .constant('version', '0.0.1')

        // where to redirect users if they need to authenticate (see routeSecurity.js)
        .constant('loginRedirectPath', '/components/login/login')

        

