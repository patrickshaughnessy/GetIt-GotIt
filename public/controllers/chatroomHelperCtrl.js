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
        sender: $scope.user.$id
      });
      $scope.newMessageText = '';
    };

    var classroomsRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms`);

    // if helpee closes the chat, send to home
    var chatroomsRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/chatrooms`);
    chatroomsRef.on('child_removed', function(chatroom){
      // if teacher ends the class - special case of child_removed, send student to home;
      classroomsRef.once('value', function(classrooms){
        // case 1) classroom still exists && the removed chatroom is current chatroom
        if (classrooms.hasChild($state.params.classID) && (chatroom.key() === $state.params.chatID)){
          $scope.backToClass();
        } else if (!classrooms.hasChild($state.params.classID)) {   // case 2) classroom has been removed
          $scope.user.helpee = false;
          $scope.user.helper = false;
          $scope.user.class = null;
          $state.go('home');
        }
      });
    });


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
