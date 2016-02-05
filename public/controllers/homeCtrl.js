'use strict';

angular
  .module('app')
  .controller("homeCtrl", function(currentAuth, Auth, $state, $rootScope, $scope, $firebaseObject, $firebaseArray) {

    var userRef = new Firebase(`https://getitgotit.firebaseio.com/users/${currentAuth.uid}`);
    var user = $firebaseObject(userRef);
    user.$bindTo($scope, 'user');

    var classroomsRef = new Firebase("https://getitgotit.firebaseio.com/classrooms");
    var classrooms = $firebaseObject(classroomsRef);
    classrooms.$bindTo($scope, 'classrooms');

    var genClassID = function(){
      var id = (parseInt(Math.random()*1000000000, 10)).toString().replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');
      return $scope.classrooms[id] || id.length !== 11 ? genClassID() : id;
    }

    $scope.startNewClass = function(){
      if (!$scope.user || !$scope.classrooms) return;

      if (!$scope.user.teacher){
        var id = genClassID()
        $scope.classrooms[id] = {
          teacher: currentAuth.uid
        };
        $scope.user.teacher = true;

        $state.go('teacher-classroom', {classID: id});
      }
    }

    $scope.goToClass = function(){
      // wait for firebase connection, return if not valid input
      if (!$scope.user || !$scope.classrooms || !$scope.classID) return;

      var classID = $scope.classID.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');

      // if no class with that ID exists or user is trying to join a different class
      if (!$scope.classrooms[classID]) return;

      // otherwise, log them into the class
      var studentsRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${classID}/students`);
      var studentsList = $firebaseArray(studentsRef);
      studentsList.$loaded().then(function(list){

        list.$add(currentAuth.uid).then(function(ref){
          var key = ref.key();
          $scope.user.class = {
            id: classID,
            key: key
          };
          $state.go('student-classroom', {classID: classID});
        });
      })
    }

    $scope.rejoinClass = function(){
      // if user is logged in to a class already, only let them re-join that class
      $state.go('student-classroom', {classID: $scope.user.class.id});
    }

    $scope.logout = function(){
      Auth.$unauth();
      $state.go('splash');
    }

  });
