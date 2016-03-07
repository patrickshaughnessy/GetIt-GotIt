'use strict';

angular
  .module('app')
  .controller("studentCtrl", function(Auth, currentAuth, $state, $rootScope, $scope, $interval, $firebaseObject, $firebaseArray, $timeout, $window) {

    var userRef = new Firebase(`https://ch-getitgotit.firebaseio.com/users/${currentAuth.uid}`);
    var user = $firebaseObject(userRef);
    var student;
    user.$bindTo($scope, 'user').then(function(){
      var studentRef = new Firebase(`https://ch-getitgotit.firebaseio.com/classrooms/static/students/${$scope.user.$id}`);
      student = $firebaseObject(studentRef);
      student.$bindTo($scope, 'student').then(function(){
        $scope.student = {
          name: $scope.user.name,
          avatar: $scope.user.avatar,
          color: $scope.student.color ? $scope.student.color : 'gray'
        }
        $scope.studentBackground = {background: $scope.student.color}
      })
      studentRef.onDisconnect().remove();
    });

    // remove student if teacher ends the class;
    var classroomsRef = new Firebase(`https://ch-getitgotit.firebaseio.com/classrooms`);
    classroomsRef.on('child_removed', function(removedClassroom){
      console.log(removedClassroom.key());
      if (removedClassroom.key() === 'static') {
        Auth.$unauth();
        document.querySelectorAll("link[rel*='icon'")[0].setAttribute('href', `assets/greencircle.ico`);
        $state.go('splash');
      }
    });


    $scope.changeColor = function(color){
      $scope.studentBackground = {background: color}
      $scope.student.color = color;
      document.querySelectorAll("link[rel*='icon'")[0].setAttribute('href', `assets/${color}circle.ico`);
      $scope.resetInterval();
    }


    var classroomRef = new Firebase(`https://ch-getitgotit.firebaseio.com/classrooms/static`);
    var classroom = $firebaseObject(classroomRef);
    classroom.$bindTo($scope, 'classroom').then(function(){
      $scope.resetInterval();
    });

    $scope.interval;
    $scope.resetInterval = function(){
      if ($scope.interval){
        $interval.cancel($scope.interval)
        $scope.interval = undefined;
      }

      $scope.interval = $interval(function(){
        $scope.changeColor('gray')
      }, $scope.classroom.interval)
    }

    // $scope.leaveClass = function(){
    //   $scope.loading = true;
    //   student.$remove();
    //   $scope.user.classroom = null;
    //   $timeout(function(){
    //     Auth.$unauth();
    //     document.querySelectorAll("link[rel*='icon'")[0].setAttribute('href', `assets/greencircle.ico`);
    //     $state.go('splash');
    //   },300)
    // }

  });
