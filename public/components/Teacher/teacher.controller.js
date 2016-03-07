'use strict';

angular
  .module('app')
  .controller("teacherCtrl", function(Auth, currentAuth, $state, $scope) {

    if (currentAuth && currentAuth.provider === "password") {
      $scope.auth = currentAuth;
    }

    $scope.loginWithEmail = function(login){
      $scope.loggingIn = true;
      Auth.$authWithPassword(login).then(function(authData) {
        $scope.auth = authData;
      }).catch(function(error) {
        swal("Login Failed!", error, 'error');
        $scope.loggingIn = false;
      });
    }



  });
