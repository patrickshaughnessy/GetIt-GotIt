'use strict';

angular
  .module('app')
  .service('AuthService', function($state){

    var user;
    // Create a callback which logs the current auth state
    function authDataCallback(authData) {
      if (authData) {
        user = authData;
      } else {
        return $state.go('splash');
      }
    }

    // Register the callback to be fired every time auth state changes
    var ref = new Firebase("https://getitgotit.firebaseio.com");
    this.checkAuth = function(){
      ref.onAuth(authDataCallback);
      return user ? user : (setTimeout(function(){return user}, 500))();
    }

    this.logout = function(){
      ref.unauth();
      $state.go('splash');
    }

  })
