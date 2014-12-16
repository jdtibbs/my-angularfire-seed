angular.module('app', [])
        .controller('PasswordController', function PasswordController() {
            this.password = '';
            this.grade = function () {
                var size = this.password.length;
                if (size > 8) {
                    this.strength = 'strong';
                } else if (size > 3) {
                    this.strength = 'medium';
                } else {
                    this.strength = 'weak';
                }
            };
        });