'use strict';

angular
  .module('app')
  .controller("chatroomHelpeeCtrl", function(Auth, currentAuth, $state, $scope, $firebaseObject, $firebaseArray, $location, $anchorScroll) {

    var usersRef = new Firebase(`https://getitgotit.firebaseio.com/users`);
    var users = $firebaseObject(usersRef);
    users.$bindTo($scope, 'users');

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

    // remove student if teacher ends the class;
    var classroomsRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms`);
    classroomsRef.on('child_removed', function(removedClassroom){
      if (removedClassroom.key() === $state.params.classID) {
        $scope.user.helpee = false;
        $scope.user.helper = false;
        $scope.user.class = null;
        $state.go('home');
      }
    });

    $scope.backToClass = function(){

      // update students list in class for viz
      var index = $scope.students.$indexFor($scope.user.class.key);
      $scope.students.$getRecord($scope.user.class.key).helpee = false;
      $scope.user.helpee = false;

      // add points to helpee if helper present;
      if ($scope.chatroom.helper){
        $scope.user.points = $scope.user.points + 1;
        $scope.students.$getRecord($scope.user.class.key).points = $scope.user.points;
      };
      $scope.students.$save(index);

      chatroom.$remove();

      $state.go('student-classroom', {classID: $state.params.classID})
    }

  });
