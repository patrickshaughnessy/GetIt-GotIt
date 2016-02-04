'use strict';

angular
  .module('app')
  .controller("teacherCtrl", function(AuthService, $state, $scope, $firebaseObject) {
    var user = AuthService.checkAuth();

    $scope.classID = $state.params.classID;

    var classroomRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}`);
    var studentsRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/students`);

    var students = $firebaseObject(studentsRef);
    students.$bindTo($scope, 'students')

    $scope.endClass = function(){
      classroomRef.remove();
      $state.go('home');
    }

  });
