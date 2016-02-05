'use strict';

angular
  .module('app')
  .controller("teacherCtrl", function(AuthService, $state, $scope, $firebaseObject, $firebaseArray) {
    var user = AuthService.checkAuth();

    $scope.classID = $state.params.classID;

    var classroomRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}`);
    var studentsRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/students`);
    var usersRef = new Firebase(`https://getitgotit.firebaseio.com/users`);
    var helpeesRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/helpees`);
    var helpersRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/helpers`);

    var students = $firebaseObject(studentsRef);
    students.$bindTo($scope, 'students');

    var users = $firebaseObject(usersRef);
    users.$bindTo($scope, 'users');

    var helpees = $firebaseArray(helpeesRef);
    var helpers = $firebaseArray(helpersRef);

    $scope.totalStudents = $firebaseArray(studentsRef);

    $scope.fillColor = function(uid){
      var color = 'green';
      helpees.forEach(function(s){
        if (s.$value == uid){
          color = 'red';
        }
      });
      helpers.forEach(function(s){
        if (s.$value == uid){
          color = 'blue'
        }
      })
      return color;
    }

    var studentsNum;
    var helpeesNum;
    studentsRef.on('value', function(snap){
      studentsNum = snap.numChildren();
      updatePercentage();
    })

    helpeesRef.on('value', function(snap){
      helpeesNum = snap.numChildren();
      updatePercentage();
    })

    function updatePercentage() {
      if (studentsNum === 0){
        $scope.percentage = 'Waiting For Students...';
      } else {
        $scope.percentage = ((1 - helpeesNum/studentsNum)*100).toString() + '%';
      }
    }




    $scope.endClass = function(){
      classroomRef.remove();
      $state.go('home');
    }

  });
