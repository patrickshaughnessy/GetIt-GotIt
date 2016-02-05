'use strict';

angular
  .module('app')
  .controller("studentCtrl", function(AuthService, $state, $scope, $firebaseObject, $firebaseArray) {
    var user = AuthService.checkAuth();

    var classroomRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}`);
    var chatroomsRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/chatrooms`);
    var helpeesRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/helpees`);
    var helpersRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/helpers`);

    var studentsArrayRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/studentsArray`);
    var studentsList = $firebaseArray(studentsArrayRef);

    var helpeesList = $firebaseArray(helpeesRef)
    var helpersList = $firebaseArray(helpersRef)


    var userIndex;
    studentsList.$loaded(function(){
      studentsList.forEach(function(s, i){
        if (s.student == user.uid){
          userIndex = i;
          return true;
        }
      });
      console.log(userIndex);
    });

    $scope.needHelp = function(){
      // create new chatroom for user
      classroomRef.child('chatrooms').once('value', function(snap){
        var newChatID = snap.exists() ? snap.val().length : 0;

        classroomRef.child(`chatrooms/${newChatID}`).set({
          helpee: user
        });

        helpeesList.$add(user.uid);

        studentsList[userIndex].helpee = true;
        studentsList.$save(userIndex);

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

            var helping = chatroomSnap.val().helpee.uid;

            classroomRef.child(`chatrooms/${chatID}`).update({ helper: user });

            helpersList.$add(user.uid);

            studentsList[userIndex].helper = true;
            console.log('helping', helping);
            studentsList[userIndex].helping = helping;

            studentsList.$save(userIndex);



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

      var index;
      studentsList.forEach(function(s, i){
        if (s.student == user.uid){
          index = i;
          return true;
        }
      });
      console.log('index', index);
      studentsList.$remove(studentsList[index]);

      $state.go('home');
    }


  });
