'use strict';

angular
  .module('app')
  .controller("teacherCtrl", function(DataService, Auth, currentAuth, $state, $scope, $firebaseObject, $firebaseArray, $timeout) {

    $scope.classID = $state.params.classID;

    var userRef = new Firebase(`https://getitgotit.firebaseio.com/users/${currentAuth.uid}`);
    var user = $firebaseObject(userRef);
    user.$bindTo($scope, 'user');

    var classroomRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}`);
    var classroom = $firebaseObject(classroomRef);
    classroom.$bindTo($scope, 'classroom');

    var studentsRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/students`);
    $scope.students = $firebaseArray(studentsRef);

    var chatroomsRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/chatrooms`);
    $scope.chatrooms = $firebaseArray(chatroomsRef);

    var updatePercentage = function(){
      if ($scope.students.length){
        $scope.percentage = Math.round((1 - ($scope.chatrooms.length / $scope.students.length))*100) + '%';
      } else {
        $scope.percentage = '...';
      }
    }

    var updatePoints = function(){
      $scope.points = $scope.students.reduce(function(a, student){
        return a + student.points;
      }, 0);
    }

    $scope.chatrooms.$watch(function(e){
      updatePercentage();
    });
    $scope.students.$watch(function(e){
      updatePercentage();
      updatePoints();
    });



    $scope.endClass = function(){
      $scope.loading = true;

      classroomRef.once('value', function(classData){
        DataService.save(classData.val()).then(function(success){
          console.log(success);
          classroom.$remove();
          $scope.user.teacher = false;
          $state.go('home');
        })
        .catch(function(err){
          console.log('error', err);
          $scope.loading = false;
        })
      })
    }

  });
