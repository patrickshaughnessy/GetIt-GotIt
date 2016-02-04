'use strict';

angular
  .module('app')
  .controller("splashCtrl", function($state, $scope, $firebaseObject) {
    var ref = new Firebase("https://getitgotit.firebaseio.com/");

    $scope.login = function(){
      ref.authWithOAuthPopup("facebook", function(error, authData) {
        if (error) {
          console.log("Authentication Failed!", error);
        } else {
          $state.go('home');
        }
      });
    }

    $scope.loginAnonymously = function(){
      ref.authAnonymously(function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
          $state.go('home');
        }
      });
    }
  });
