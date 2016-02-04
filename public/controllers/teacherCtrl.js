'use strict';

angular
  .module('app')
  .controller("teacherCtrl", function(AuthService, $state, $scope, $firebaseObject) {
    var user = AuthService.checkAuth();

    $scope.classID = $state.params.classID;

    var classroomRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}`);
    var studentsRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/students`);
    var usersRef = new Firebase(`https://getitgotit.firebaseio.com/users`);
    var helpeesRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/helpees`);

    var students = $firebaseObject(studentsRef);
    students.$bindTo($scope, 'students');

    var users = $firebaseObject(usersRef);
    users.$bindTo($scope, 'users');

    var helpees = $firebaseObject(helpeesRef);
    helpees.$bindTo($scope, 'helpees');


    $scope.endClass = function(){
      classroomRef.remove();
      $state.go('home');
    }

  });
