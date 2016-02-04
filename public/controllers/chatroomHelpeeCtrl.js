'use strict';

angular
  .module('app')
  .controller("chatroomHelpeeCtrl", function(AuthService, $state, $scope, $firebaseObject, $firebaseArray, $location, $anchorScroll) {
    $scope.user = AuthService.checkAuth();
    var chatRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/chatrooms/${$state.params.chatID}`);
    var helpeeMsgsRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/chatrooms/${$state.params.chatID}/helpee/messages`);
    var helpeesRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/helpees`);
    var classroomRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}`);


    var helpeesList = $firebaseArray(helpeesRef)

     $scope.messages = $firebaseArray(helpeeMsgsRef);
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

      var index;
      helpeesList.forEach(function(s, i){
        if (s.$value == $scope.user.uid){
          index = i;
          return true;
        }
      });

      helpeesList.$remove(helpeesList[index]);

      $state.go('student-classroom', {classID: $state.params.classID})
    }

  });
