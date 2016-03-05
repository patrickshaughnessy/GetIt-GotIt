'use strict';

angular
  .module('app')
  .factory("Auth", ["$firebaseAuth", function($firebaseAuth) {
      var ref = new Firebase("https://ch-getitgotit.firebaseio.com");
      return $firebaseAuth(ref);
    }
  ]);
