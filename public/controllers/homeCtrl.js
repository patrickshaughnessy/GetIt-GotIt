'use strict';

angular
  .module('app')
  .controller("homeCtrl", function(AuthService, $state, $scope, $firebaseObject, $firebaseArray) {
    var user = AuthService.checkAuth();

    var classroomsRef = new Firebase("https://getitgotit.firebaseio.com/classrooms");


    $scope.startNewClass = function(){
      classroomsRef.once('value', function(snap){
        var newClass = {teacher: user}

        var newClassID = snap.exists() ? snap.val().length : 0;
        classroomsRef.child(newClassID).set(newClass);

        $state.go('teacher-classroom', {classID: newClassID});
      })
    }

    $scope.goToClass = function(classID){
      classroomsRef.child(classID).once('value', function(snap){
        if (snap.exists()) {
          classroomsRef.child(classID).child('students').child(user.uid).set(user);

          var studentsArrayRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${classID}/studentsArray`);
          var studentsArray = $firebaseArray(studentsArrayRef);
          studentsArray.$add({
            student: user.uid,
            helpee: false,
            helper: false,
            helping: null
          });

          $state.go('student-classroom', {classID: classID});
        } else {
          // handle error
        }
      })
    }

    $scope.logout = function(){
      AuthService.logout();
    }

  });
