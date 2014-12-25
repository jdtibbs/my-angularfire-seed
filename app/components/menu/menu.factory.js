(function () {

    'use strict';

    angular.module('menu.module')
            .factory('menuFactory', factory);

    factory.$inject = [/* 'someDependency' */];

    function factory(/* someDependency */) {
        var factory = {
            menu: function () {
                var menu = {
                    "items": [{
                            "value": "Chat",
                            "url": "#/chat"
                        }, {
                            "value": "Inventory",
                            "url": "#/inventory"
                        }, {
                            "value": "Contacts",
                            "url": "#/contacts"
                        }, {
                            "value": "Account",
                            "url": "",
                            "items": [{"value": "Profile", "url": "#/user/profile"},
                                {"value": "Password", "url": "#/user/password"},
                                {"value": "Email", "url": "#/user/email"}
                            ]
                        }]};
                return menu.items;
            }
        };
        return factory;
    }
})();