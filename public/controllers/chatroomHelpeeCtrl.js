'use strict';

angular
  .module('app')
  .controller("chatroomHelpeeCtrl", function(AuthService, $state, $scope, $firebaseObject) {
    var user = AuthService.checkAuth();
    var chatRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/chatrooms/${$state.params.chatID}`);

    $scope.backToClass = function(){
      chatRef.remove();
      $state.go('student-classroom', {classID: $state.params.classID})
    }

  });
