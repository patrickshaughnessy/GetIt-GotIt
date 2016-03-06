'use strict';

angular
  .module('app')
  .controller("studentCtrl", function(Auth, currentAuth, $state, $rootScope, $scope, $firebaseObject, $firebaseArray, $timeout, $window) {

    var userRef = new Firebase(`https://ch-getitgotit.firebaseio.com/users/${currentAuth.uid}`);
    var user = $firebaseObject(userRef);
    var student;
    user.$bindTo($scope, 'user').then(function(){
      var studentRef = new Firebase(`https://ch-getitgotit.firebaseio.com/classrooms/${$state.params.classID}/students/${$scope.user.$id}`);
      student = $firebaseObject(studentRef);
      student.$bindTo($scope, 'student')
    });

    var classroomRef = new Firebase(`https://ch-getitgotit.firebaseio.com/classrooms/${$state.params.classID}`);
    var classroom = $firebaseObject(classroomRef);
    classroom.$bindTo($scope, 'classroom');

    // remove student if teacher ends the class;
    var classroomsRef = new Firebase(`https://ch-getitgotit.firebaseio.com/classrooms`);
    classroomsRef.on('child_removed', function(removedClassroom){
      if (removedClassroom.key() === $state.params.classID) {
        $scope.user.classroom = null;
        $state.go('home');
      }
    });



    $scope.studentBackground = {background: 'gray'}
    $scope.changeColor = function(color){
      $scope.studentBackground = {background: color}
      $scope.student.color = color;
      document.querySelectorAll("link[rel*='icon'")[0].setAttribute('href', `assets/${color}circle.ico`);
    }

    $scope.leaveClass = function(){
      $scope.loading = true;
      student.$remove();
      $scope.user.classroom = null;
      $state.go('home');
    }

    $scope.logout = function(){
      $scope.loading = true;
      student.$remove();
      $scope.user.classroom = null;
      $timeout(function(){
        Auth.$unauth();
        $state.go('splash');
      },300)
    }

  });
