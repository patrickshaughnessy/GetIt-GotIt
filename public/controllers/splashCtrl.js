'use strict';

angular
  .module('app')
  .controller("splashCtrl", function(AuthService, $state, $scope, $firebaseObject) {
    var ref = new Firebase("https://getitgotit.firebaseio.com/");

    $scope.loginWithFacebook = function(){
      ref.authWithOAuthPopup("facebook", function(error, authData) {
        if (error) {
          console.log("Authentication Failed!", error);
        } else {
          console.log('auth success', authData);
          $state.go('home');
        }
      });
    }

    $scope.signUpWithEmail = function(){
      ref.createUser({
        email    : $scope.signupEmail,
        password : $scope.signupPassword
      }, function(error, userData) {
        if (error) {
          console.log("Error creating user:", error);
        } else {
          console.log("Successfully created user account with uid:", userData.uid);
          ref.authWithPassword({
            email    : $scope.signupEmail,
            password : $scope.signupPassword
          }, function(error, authData) {
            if (error) {
              console.log("Login Failed!", error);
            } else {
              console.log("Authenticated successfully with payload:", authData);
              $state.go('home');
            }
          });
        }
      });
    }

    $scope.loginWithEmail = function(){
      ref.authWithPassword({
        email    : $scope.loginEmail,
        password : $scope.loginPassword
      }, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
          $state.go('home');
        }
      });
    }

  });
