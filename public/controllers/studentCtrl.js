'use strict';

angular
  .module('app')
  .controller("studentCtrl", function($state, $scope, $firebaseObject) {
    var ref = new Firebase("https://getitgotit.firebaseio.com/data");

    // download the data into a local object
    var syncObject = $firebaseObject(ref);

    // synchronize the object with a three-way data binding
    // click on `index.html` above to see it used in the DOM!
    syncObject.$bindTo($scope, "data");

    $scope.needHelp = function(){
      // create new chatroom for user

      // send to chatroomID
      $state.go('chatroom-helpee', {'id': 1})
    }

    $scope.helpSomeone = function(){
      // join chatroom of user that needs help

      // send to chatroomID
      $state.go('chatroom-helper', {'id': 1})
    }
  });
