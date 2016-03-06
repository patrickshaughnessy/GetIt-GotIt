'use strict';

angular
  .module('app')
  .controller("splashCtrl", function(Auth, currentAuth, $state, $scope, $firebaseObject) {

    if (currentAuth){
      $state.go('home');
    }

    var usersRef = new Firebase('https://ch-getitgotit.firebaseio.com/users')
    var users = $firebaseObject(usersRef);

    $scope.loginWithFacebook = function(){
      $scope.loggingIn = true;
      Auth.$authWithOAuthPopup("facebook").then(function(authData) {
        if (!users[authData.uid]){
          users[authData.uid] = {
            name: authData.facebook.displayName,
            avatar: authData.facebook.profileImageURL,
          }
          users.$save();
        }
        return $state.go('home');
      }).catch(function(error){
        swal("Authentication Failed!", error, 'error');
        $scope.loggingIn = false;
      })
    }

    $scope.loginWithGithub = function(){
      $scope.loggingIn = true;
      Auth.$authWithOAuthPopup("github").then(function(authData) {
        if (!users[authData.uid]){
          users[authData.uid] = {
            name: authData.github.displayName,
            avatar: authData.github.profileImageURL,
          }
          users.$save();
        }
        return $state.go('home');
      }).catch(function(error){
        swal("Authentication Failed!", error, 'error');
        $scope.loggingIn = false;
      })
    }


  });
