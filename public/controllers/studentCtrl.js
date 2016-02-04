'use strict';

angular
  .module('app')
  .controller("studentCtrl", function(AuthService, $state, $scope, $firebaseObject, $firebaseArray) {
    var user = AuthService.checkAuth();

    var classroomRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}`);
    var chatroomsRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/chatrooms`);

    $scope.needHelp = function(){
      // create new chatroom for user
      classroomRef.child('chatrooms').once('value', function(snap){
        var newChatID = snap.exists() ? snap.val().length : 0;

        classroomRef.child(`chatrooms/${newChatID}`).set({
          helpee: user
        });

        classroomRef.child('helpees').once('value', function(helpeesSnap){
          var helpees = helpeesSnap.exists() ? helpeesSnap.val() : [];
          helpees.push(user.uid);
          classroomRef.update({
            helpees: helpees
          });
        })

        // send to chatroomID
        $state.go('chatroom-helpee', {classID: $state.params.classID, chatID: newChatID});
      })
    }

    $scope.helpSomeone = function(){
      // join chatroom of user that needs help
      classroomRef.child('chatrooms').once('value', function(snap){

        snap.forEach(function(chatroomSnap){
          if (!chatroomSnap.val().helper){
            var chatID = chatroomSnap.key();

            classroomRef.child(`chatrooms/${chatID}`).update({ helper: user });

            classroomRef.child('helpers').once('value', function(helpersSnap){
              var helpers = helpersSnap.exists() ? helpersSnap.val() : [];
              helpers.push(user.uid);
              classroomRef.update({
                helpers: helpers
              });
            })

            // send to chatroomID
            $state.go('chatroom-helper', {classID: $state.params.classID, chatID: chatID});
            return true;
          }
        })
      })
    }

    //display help button
    classroomRef.child('chatrooms').on('value', function(chatroomsSnap){

      if (!chatroomsSnap.exists()){
        classroomRef.child('displayHelpButton').set({
          display: false
        });
      }

      chatroomsSnap.forEach(function(chatroomSnap){
        console.log(chatroomSnap.val());
        if (chatroomSnap.numChildren() === 1){
          classroomRef.child('displayHelpButton').set({
            display: true
          });
          return true;
        }
        classroomRef.child('displayHelpButton').set({
          display: false
        });
      });
    })

    var displayHelpButtonRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/displayHelpButton`);
    var displayHelpButton = $firebaseObject(displayHelpButtonRef);
    displayHelpButton.$bindTo($scope, 'displayHelpButton');


    $scope.leaveClass = function(){
      classroomRef.child(`students/${user.uid}`).remove();
      $state.go('home');
    }


  });
