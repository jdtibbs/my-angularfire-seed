(function () {
    'use strict';

    // Declare app level module which depends on filters, and services
    angular.module('app', [
        'templates',
        'about.module',
        'directives.module',
        'exception.module',
        'firebase.module', // sb able to remove this if app modules spec it.
        'login.module',
        'menu.module',
        'user.module',
        'chat.module',
        'my.home.controller',
        'my.inventory.controller',
        'my.inventoryDetail.controller',
        'my.contacts.controller',
        'my.contactsDetail.controller',
        'filters.module'
    ]);

})();

