'use strict';

/* Filters */

angular.module('filters.module', [])

   .filter('reverse', function() {
      return function(items) {
         return items.slice().reverse();
      };
   });
