'use strict';

angular
  .module('app')
  .controller("studentCtrl", function(Auth, currentAuth, $state, $rootScope, $scope, $firebaseObject, $firebaseArray) {

    var userRef = new Firebase(`https://getitgotit.firebaseio.com/users/${currentAuth.uid}`);
    var user = $firebaseObject(userRef);
    user.$bindTo($scope, 'user');

    var classroomRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}`);
    var classroom = $firebaseObject(classroomRef);
    classroom.$bindTo($scope, 'classroom');

    var studentsRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/students`);
    $scope.students = $firebaseArray(studentsRef);


    var chatroomsRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/chatrooms`);
    $scope.chatrooms = $firebaseArray(chatroomsRef);


    // var helpeesRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/helpees`);
    // var helpersRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/helpers`);
    //
    // var studentsArrayRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/studentsArray`);
    // var studentsList = $firebaseArray(studentsArrayRef);
    //
    // var helpeesList = $firebaseArray(helpeesRef)
    // var helpersList = $firebaseArray(helpersRef)


    $scope.needHelp = function(){
      // create new chatroom for user
      if (!$scope.user || !$scope.chatrooms) return;

      $scope.chatrooms.$add({ helpee: currentAuth.uid }).then(function(chat){
        var chatID = chat.key();
        console.log('added chat with id', chatID);
        $scope.user.helpee = true;
        $state.go('chatroom-helpee', {classID: $state.params.classID, chatID: chatID});
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
            studentsList[userIndex].helping = helping;

            studentsList.$save(userIndex);



            // send to chatroomID
            $state.go('chatroom-helper', {classID: $state.params.classID, chatID: chatID});
            return true;
          }
        })
      })
    }

    // //display help button
    // classroomRef.child('chatrooms').on('value', function(chatroomsSnap){
    //
    //   if (!chatroomsSnap.exists()){
    //     classroomRef.child('displayHelpButton').set({
    //       display: false
    //     });
    //   }
    //
    //   chatroomsSnap.forEach(function(chatroomSnap){
    //     if (chatroomSnap.numChildren() === 1){
    //       classroomRef.child('displayHelpButton').set({
    //         display: true
    //       });
    //       return true;
    //     }
    //     classroomRef.child('displayHelpButton').set({
    //       display: false
    //     });
    //   });
    // })
    //
    // var displayHelpButtonRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/displayHelpButton`);
    // var displayHelpButton = $firebaseObject(displayHelpButtonRef);
    // displayHelpButton.$bindTo($scope, 'displayHelpButton');


    $scope.leaveClass = function(){
      $scope.students.$remove($scope.students.$getRecord($scope.user.class.key));
      $scope.user.class = null;
      $state.go('home');
    }


  });
