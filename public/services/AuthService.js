'use strict';

angular
  .module('app')
  .service('AuthService', function($state){

    var ref = new Firebase("https://getitgotit.firebaseio.com");

    function getName(authData) {
      switch(authData.provider) {
         case 'password':
           return authData.password.email.replace(/@.*/, '');
         case 'twitter':
           return authData.twitter.displayName;
         case 'facebook':
           return authData.facebook.displayName;
      }
    }

    var isNewUser = true;

    ref.onAuth(function(authData) {
      if (authData && isNewUser) {
        // save the user's profile into the database so we can list users,
        // use them in Security and Firebase Rules, and show profiles
        ref.child("users").child(authData.uid).set({
          provider: authData.provider,
          name: getName(authData)
        });
      }
    });


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
