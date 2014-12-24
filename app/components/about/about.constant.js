(function () {
    'use strict';

    angular.module('about.module')
            .constant('appName', 'App Name')
    
            // version x.y.z
            // Where:
            // x = main version number, 1-~.
            // y = feature number, 0-9. Increase this number if the change contains new features with or without bug fixes.
            // z = hotfix number, 0-~. Increase this number if the change only contains bug fixes.
            .constant('version', 'Version 0.0.1')

            .constant('copyright', 'Copyright jdtibbs 2014');
})();