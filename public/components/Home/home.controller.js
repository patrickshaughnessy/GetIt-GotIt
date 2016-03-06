'use strict';

angular
  .module('app')
  .controller("homeCtrl", function(currentAuth, Auth, $state, $rootScope, $scope, $firebaseObject, $firebaseArray, $timeout) {

    $scope.loading = false;

    var userRef = new Firebase(`https://ch-getitgotit.firebaseio.com/users/${currentAuth.uid}`);
    var user = $firebaseObject(userRef);
    user.$bindTo($scope, 'user')

    var classroomsRef = new Firebase("https://ch-getitgotit.firebaseio.com/classrooms");
    var classrooms = $firebaseObject(classroomsRef);
    classrooms.$bindTo($scope, 'classrooms');
    var classroomsIDsRef = new Firebase("https://ch-getitgotit.firebaseio.com/classroomsIDs");
    var classroomsIDs = $firebaseObject(classroomsIDsRef);
    classroomsIDs.$bindTo($scope, 'classroomsIDs');

    var genClassID = function(){
      var id = (parseInt(Math.random()*1000000000, 10)).toString().replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');
      // first class ever
      if (!$scope.classroomsIDs){
        return id;
      }
      // previously used ID or invalid ID: try again
      return ($scope.classroomsIDs[id] || id.length !== 11) ? genClassID() : id;
    }

    $scope.startNewClass = function(){
      $scope.loading = true;
      if (!$scope.user || !$scope.classrooms) {
        $scope.loading = false;
        return;
      }

      if (!$scope.user.teacher){
        var id = genClassID();
        // record teacherID to classroomIDs and set teacher in new classroom instance
        $scope.classroomsIDs[id] = { teacher: currentAuth.uid };
        $scope.classrooms[id] = { teacher: currentAuth.uid };
        $scope.user.teacher = id;
        $state.go('teacher', {classID: id});
      } else {
        // some error occurred
        $scope.loading = false;
      }

    }

    $scope.goToClass = function(classroom){
      console.log('classroom', classroom);
      $scope.loading = true;
      // wait for firebase connection, return if not valid input
      if (!$scope.user || !$scope.classrooms || !classroom.id) {
        $scope.loading = false;
        return;
      }

      var classID = classroom.id.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');

      // if no class with that ID exists, show error message
      if (!$scope.classrooms[classID]){
        $scope.loading = false;
        return swal('Oops', 'No class exists with that ID. Did you type it correctly?', 'error');
      };

      // otherwise, log them into the class
      var studentsRef = new Firebase(`https://ch-getitgotit.firebaseio.com/classrooms/${classID}/students`);
      var students = $firebaseObject(studentsRef);
      students.$bindTo($scope, 'students').then(function(){
        var student = angular.copy($scope.user);
        student.color= 'gray';
        $scope.students[$scope.user.$id] = student;
        $scope.user.classroom = {
          id: classID
        };
        $state.go('student', {classID: classID});
      });
    }

    $scope.logout = function(){
      $scope.loading = true;
      Auth.$unauth();
      $state.go('splash');
    }

  });
