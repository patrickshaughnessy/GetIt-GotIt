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

    $scope.percentage = '100%';

    helpeesRef.on('value', function(snap){
      var helpeeNum = snap.numChildren();
      studentsRef.once('value', function(s){
        var studentsNum = s.numChildren();
        $scope.percentage = ((1 - (helpeeNum / studentsNum)) * 100).toString() + '%';
      })
    })



    $scope.endClass = function(){
      classroomRef.remove();
      $state.go('home');
    }

  });
