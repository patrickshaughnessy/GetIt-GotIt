'use strict';

angular
  .module('app')
  .controller("chatroomHelpeeCtrl", function(AuthService, $state, $scope, $firebaseObject, $firebaseArray, $location, $anchorScroll) {
    $scope.user = AuthService.checkAuth();
    var chatRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/chatrooms/${$state.params.chatID}`);
    var helpeeRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/chatrooms/${$state.params.chatID}/helpee/messages`);
    var classroomRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}`);

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
      chatRef.remove();

      classroomRef.child('helpees').once('value', function(helpeesSnap){
        var helpees = helpeesSnap.val();
        helpees.splice(helpees.indexOf($scope.user.uid), 1);
        classroomRef.update({
          helpees: helpees
        });
      })

      $state.go('student-classroom', {classID: $state.params.classID})
    }

  });
