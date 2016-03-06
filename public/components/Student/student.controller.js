'use strict';

angular
  .module('app')
  .controller("studentCtrl", function(Auth, currentAuth, $state, $rootScope, $scope, $firebaseObject, $firebaseArray, $timeout, $window) {

    var userRef = new Firebase(`https://ch-getitgotit.firebaseio.com/users/${currentAuth.uid}`);
    var user = $firebaseObject(userRef);
    user.$bindTo($scope, 'user');

    var classroomRef = new Firebase(`https://ch-getitgotit.firebaseio.com/classrooms/${$state.params.classID}`);
    var classroom = $firebaseObject(classroomRef);
    classroom.$bindTo($scope, 'classroom');

    // remove student if teacher ends the class;
    var classroomsRef = new Firebase(`https://ch-getitgotit.firebaseio.com/classrooms`);
    classroomsRef.on('child_removed', function(removedClassroom){
      if (removedClassroom.key() === $state.params.classID) {
        $scope.user.class = null;
        $state.go('home');
      }
    });

    var studentsRef = new Firebase(`https://ch-getitgotit.firebaseio.com/classrooms/${$state.params.classID}/students`);
    var students = $firebaseObject(studentsRef);
    students.$bindTo($scope, 'students')

    $scope.changeColor = function(color){
      $scope.students[$scope.user.$id].color = color;
    }

    $scope.leaveClass = function(){
      $scope.loading = true;
      $scope.students.$remove($scope.students.$getRecord($scope.user.classroom.key));
      $scope.user.classroom = null;
      $state.go('home');
    }

    $scope.logout = function(){
      $scope.loading = true;
      $scope.students.$remove($scope.students.$getRecord($scope.user.classroom.key));
      $scope.user.classroom = null;
      $timeout(function(){
        Auth.$unauth();
        $state.go('splash');
      },300)
    }

  });
