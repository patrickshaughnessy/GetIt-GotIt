'use strict';

angular
  .module('app')
  .controller("splashCtrl", function(Auth, currentAuth, $state, $scope, $firebaseObject) {

    if (currentAuth){
      $state.go('home');
    }

    var usersRef = new Firebase('https://getitgotit.firebaseio.com/users')
    var users = $firebaseObject(usersRef);

    $scope.loginWithFacebook = function(){
      $scope.loggingIn = true;
      Auth.$authWithOAuthPopup("facebook").then(function(authData) {
        if (!users[authData.uid]){
          users[authData.uid] = {
            name: authData.facebook.displayName,
            avatar: authData.facebook.profileImageURL,
            points: 0,
            helpee: false,
            helper: false,
            helping: null,
            teacher: false
          }
          users.$save();
        }
        return $state.go('home');
      }).catch(function(error){
        swal("Authentication Failed!", error, 'error');
        $scope.loggingIn = false;
      })
    }

    $scope.loginWithEmail = function(){
      $scope.loggingIn = true;
      Auth.$authWithPassword({
        email    : $scope.loginEmail,
        password : $scope.loginPassword
      }).then(function(authData) {
        return $state.go('home');
      }).catch(function(error) {
        if (error == 'Error: The specified user does not exist.'){
          // user does not exist - create a new user
          signUpWithEmail();
          return;
        }
        swal("Login Failed!", error, 'error');
        $scope.loggingIn = false;
      });
    }


    var signUpWithEmail = function(){
      Auth.$createUser({
        email    : $scope.loginEmail,
        password : $scope.loginPassword
      }).then(function(userData) {
        return Auth.$authWithPassword({
          email    : $scope.loginEmail,
          password : $scope.loginPassword
        });
      }).then(function(authData) {
        if (!users[authData.uid]){
          users[authData.uid] = {
            name: authData.password.email.replace(/@.*/, ''),
            avatar: 'assets/defaultPic.png',
            points: 0,
            helpee: false,
            helper: false,
            helping: null,
            teacher: false
          }
          users.$save();
        }
        return $state.go('home');
      }).catch(function(error) {
        swal("Login Failed!", error, 'error');
        $scope.loggingIn = false;
      });
    }

  });
