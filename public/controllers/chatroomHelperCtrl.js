'use strict';

angular
  .module('app')
  .controller("chatroomHelperCtrl", function(AuthService, $state, $scope, $firebaseObject, $firebaseArray) {
    $scope.user = AuthService.checkAuth();
    var chatRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/chatrooms/${$state.params.chatID}`);

    var helpeeRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/chatrooms/${$state.params.chatID}/helpee/messages`);

    chatRef.child('helpee').on('child_removed', function(snap){
      $scope.backToClass();
    })

    // create a synchronized array
     $scope.messages = $firebaseArray(helpeeRef);
     // add new items to the array
     // the message is automatically added to our Firebase database!
     $scope.addMessage = function() {
       $scope.messages.$add({
         text: $scope.newMessageText,
         sender: $scope.user
       });
       $scope.newMessageText = '';
     };

    $scope.backToClass = function(){
      chatRef.child('helper').remove();
      $state.go('student-classroom', {classID: $state.params.classID})
    }

  });
