'use strict';

angular
  .module('app')
  .controller("homeCtrl", function($state, $scope, $firebaseObject) {
    var ref = new Firebase("https://getitgotit.firebaseio.com/data");

    // download the data into a local object
    var syncObject = $firebaseObject(ref);

    // synchronize the object with a three-way data binding
    // click on `index.html` above to see it used in the DOM!
    syncObject.$bindTo($scope, "data");


    $scope.goToClass = function(classID){
      $state.go('student-classroom', {'id': classID});
    }
  });
