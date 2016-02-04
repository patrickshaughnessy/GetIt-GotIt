'use strict';

angular
  .module('app')
  .controller("studentCtrl", function(AuthService, $state, $scope, $firebaseObject, $firebaseArray) {
    var user = AuthService.checkAuth();

    var classroomRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}`);

    $scope.needHelp = function(){
      // create new chatroom for user
      classroomRef.child('chatrooms').once('value', function(snap){
        var newChatID = snap.exists() ? snap.val().length : 0;
        classroomRef.child(`chatrooms/${newChatID}`).set({
          helpee: user
        });
        // send to chatroomID
        $state.go('chatroom-helpee', {classID: $state.params.classID, chatID: newChatID});
      })
    }

    //display help button
    classroomRef.child('chatrooms').on('value', function(snap){
      // conditions:
      // no chatrooms - don't display
      // chatrooms are full - don't display
      // any chatroom only has helpee

      snap.forEach(function(chatroomSnap){
        if (Object.keys(chatroomSnap.val()).length === 1){
          classroomRef.child('displayHelpButton').set({
            display: true
          });
          return true;
        } else {
          classroomRef.child('displayHelpButton').set({
            display: false
          });
        }
      });
    })

    var displayHelpButtonRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/displayHelpButton`);
    var syncObj = $firebaseObject(displayHelpButtonRef);
    syncObj.$bindTo($scope, 'displayHelpButton');

    $scope.helpSomeone = function(){
      // join chatroom of user that needs help
      classroomRef.child('chatrooms').once('value', function(snap){

        snap.forEach(function(chatroomSnap){
          if (!chatroomSnap.val().helper){
            var chatID = chatroomSnap.key();

            classroomRef.child(`chatrooms/${chatID}`).update({ helper: user });

            // send to chatroomID
            $state.go('chatroom-helper', {classID: $state.params.classID, chatID: chatID});
            return true;
          }
        })
      })

    }

    $scope.leaveClass = function(){
      classroomRef.child(`students/${user.uid}`).remove();
      $state.go('home');
    }


  });
