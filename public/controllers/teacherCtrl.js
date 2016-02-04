'use strict';

angular
  .module('app')
  .controller("teacherCtrl", function(AuthService, $scope, $firebaseObject) {
    AuthService.checkAuth();
    var ref = new Firebase("https://getitgotit.firebaseio.com/");

  });
