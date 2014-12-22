(function () {
    'use strict';

    // Declare app level module which depends on filters, and services
    angular.module('app', [
        'config.module',
        'exception.module',
        'firebase.module', // sb able to remove this if app modules spec it.
        'user.module',
        'chat.module',
        'my.home.controller',
        'my.inventory.controller',
        'my.inventoryDetail.controller',
        'my.contacts.controller',
        'my.contactsDetail.controller',
        'my.login.controller',
        'my.menu.controller',
        'decorators.module',
        'directives.module',
        'filters.module',
        'ngRoute'
    ]);

})();

