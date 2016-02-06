'use strict';

angular
  .module('app')
  .controller("studentCtrl", function(Auth, currentAuth, $state, $rootScope, $scope, $firebaseObject, $firebaseArray, $timeout) {

    var userRef = new Firebase(`https://getitgotit.firebaseio.com/users/${currentAuth.uid}`);
    var user = $firebaseObject(userRef);
    user.$bindTo($scope, 'user').then(function(){
      // make sure user didn't use back button to leave
      $timeout(function(){
        if ($scope.user.helpee){
          $state.go('chatroom-helpee', {classID: $state.params.classID, chatID: $scope.user.helpee});
        }
      }, 100)
    })

    var classroomRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}`);
    var classroom = $firebaseObject(classroomRef);
    classroom.$bindTo($scope, 'classroom');

    var studentsRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/students`);
    $scope.students = $firebaseArray(studentsRef);

    var chatroomsRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/chatrooms`);
    $scope.chatrooms = $firebaseArray(chatroomsRef);

    // display help button
    chatroomsRef.on('value', function(snap){
      if (!snap.val()){
        $scope.displayHelp = false;
      }
      snap.forEach(function(child){
        if (!child.helper){
          $scope.displayHelp = true;
          return true;
        }
        $scope.displayHelp = false;
      })
    })


    $scope.needHelp = function(){
      // create new chatroom for user
      if (!$scope.user || !$scope.chatrooms) return;

      $scope.chatrooms.$add({ helpee: currentAuth.uid }).then(function(chat){
        var chatID = chat.key();
        $scope.user.helpee = chatID;
        $state.go('chatroom-helpee', {classID: $state.params.classID, chatID: chatID});
      })
    }



    $scope.helpSomeone = function(){
      // join chatroom of user that needs help
      chatroomsRef.once('value', function(chatrooms){

        chatrooms.forEach(function(chatroom){
          if (!chatroom.val().helper){
            var index = $scope.chatrooms.$indexFor(chatroom.key())

            $scope.chatrooms[index].helper = currentAuth.uid;
            $scope.chatrooms.$save(index);

            $scope.user.helper = {
              helping: $scope.chatrooms[index].helpee,
              chatID: chatroom.key()
            }

            // send to chatroomID
            $state.go('chatroom-helper', {classID: $state.params.classID, chatID: chatroom.key()});
            return true;
          }
        })
      })
    }


    $scope.leaveClass = function(){
      $scope.students.$remove($scope.students.$getRecord($scope.user.class.key));
      $scope.user.class = null;
      $state.go('home');
    }


  });
