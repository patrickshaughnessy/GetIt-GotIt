'use strict';

angular
  .module('app')
  .controller("teacherCtrl", function(Auth, currentAuth, $state, $scope, $firebaseObject, $firebaseArray, $timeout) {

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
      if ($scope.chatrooms && $scope.students){
        $scope.percentage = Math.round((1 - ($scope.chatrooms.length / $scope.students.length))*100) + '%';
      } else {
        $scope.percentage = '...'
      }
      console.log('in perc', $scope.percentage);
    }
    $scope.chatrooms.$watch(function(e){
      console.log('chats', e)
      updatePercentage();
    });
    $scope.students.$watch(function(e){
      console.log('studs', e);
      updatePercentage();
    });


    $scope.endClass = function(){
      classroom.$remove();
      $state.go('home');
    }

  });
