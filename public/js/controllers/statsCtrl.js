'use strict';

angular
  .module('app')
  .controller("statsCtrl", function(DataService, Auth, currentAuth, $state, $scope, $firebaseObject, $firebaseArray, $timeout, $interval) {

    var userRef = new Firebase(`https://getitgotit.firebaseio.com/users/${currentAuth.uid}`);
    var user = $firebaseObject(userRef);
    user.$bindTo($scope, 'user');

  });
