'use strict';

angular
  .module('app')
  .controller("chatroomHelperCtrl", function(Auth, currentAuth, $state, $scope, $firebaseObject, $firebaseArray) {

    

    var chatRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/chatrooms/${$state.params.chatID}`);
    var helpeeMsgsRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/chatrooms/${$state.params.chatID}/helpee/messages`);
    var classroomRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}`);
    var helpersRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/helpers`);

    var studentsArrayRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/studentsArray`);
    var studentsList = $firebaseArray(studentsArrayRef);

    var userIndex;
    studentsList.$loaded(function(){
      studentsList.forEach(function(s, i){
        if (s.student == user.uid){
          userIndex = i;
          return true;
        }
      });
    });


    var helpersList = $firebaseArray(helpersRef)

    chatRef.child('helpee').on('child_removed', function(snap){
      $scope.backToClass();
    })

    // create a synchronized array
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
      chatRef.child('helper').remove();

      var index;
      helpersList.forEach(function(s, i){
        if (s.$value == $scope.user.uid){
          index = i;
          return true;
        }
      });

      helpersList.$remove(helpersList[index]);


      studentsList[userIndex].helper = false;
      studentsList[userIndex].helping = null;
      studentsList.$save(userIndex);

      $state.go('student-classroom', {classID: $state.params.classID})
    }

  });
