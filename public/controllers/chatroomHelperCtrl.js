'use strict';

angular
  .module('app')
  .controller("chatroomHelperCtrl", function(Auth, currentAuth, $state, $scope, $firebaseObject, $firebaseArray) {

    var studentsRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/students`);
    $scope.students = $firebaseArray(studentsRef);

    var userRef = new Firebase(`https://getitgotit.firebaseio.com/users/${currentAuth.uid}`);
    var user = $firebaseObject(userRef);
    user.$bindTo($scope, 'user');

    var chatroomRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/chatrooms/${$state.params.chatID}`);
    var chatroom = $firebaseObject(chatroomRef);
    chatroom.$bindTo($scope, 'chatroom');

    var messagesRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/chatrooms/${$state.params.chatID}/messages`);
    $scope.messages = $firebaseArray(messagesRef);

    $scope.addMessage = function() {
      $scope.messages.$add({
        text: $scope.newMessageText,
        sender: $scope.chatroom.helper
      });
      $scope.newMessageText = '';
    };

    // handle helpee closing chatroom;
    var chatroomsRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/chatrooms`);
    chatroomsRef.on('child_removed', function(chatroom){
      if (chatroom.key() === $state.params.chatID){
        $scope.backToClass();
      }
    })

    $scope.backToClass = function(){
      $scope.chatroom.helper = null;
      $scope.user.helper = false;

      // update students list in class for viz
      var index = $scope.students.$indexFor($scope.user.class.key);
      $scope.students.$getRecord($scope.user.class.key).helper = false;
      $scope.students.$save(index);

      $state.go('student-classroom', {classID: $state.params.classID})
    }

  });
