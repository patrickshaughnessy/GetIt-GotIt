'use strict';

angular
  .module('app')
  .controller("teacherCtrl", function(DataService, Auth, currentAuth, $state, $scope, $firebaseObject, $firebaseArray, $timeout, $interval) {

    $scope.classID = $state.params.classID;

    var dataRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${$state.params.classID}/data`);
    $scope.timeData = $firebaseArray(dataRef);

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

    var green;
    var updatePercentage = function(){
      if ($scope.students.length){
        $scope.percentage = Math.round((1 - ($scope.chatrooms.length / $scope.students.length))*100) + '%';
        if ($scope.percentage == '100%' && !green){
          document.querySelectorAll("link[rel*='icon'")[0].setAttribute('href', "assets/greencircle.ico");
          green = true;
        } else if ($scope.percentage != '100%'){
          document.querySelectorAll("link[rel*='icon'")[0].setAttribute('href', "assets/redcircle.ico");
          green = false;
        }
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


    // track realtime classroom data over time
    var recording = $interval(function(){
      var info = {
        time: Date.now(),
        percentage: (!$scope.percentage || $scope.percentage == '...') ? 0 : +$scope.percentage.slice(0,-1)
      };
      $scope.timeData.$add(info);
    }, 1000)

    $scope.endClass = function(){
      $scope.loading = true;

      $interval.cancel(recording);

      // uncomment for MongoDB
      // classroomRef.once('value', function(classData){
      //   DataService.save(classData.val()).then(function(success){
      //     console.log(success);
      //     classroom.$remove();
      //     $scope.user.teacher = false;
      //     $state.go('home');
      //   })
      //   .catch(function(err){
      //     console.log('error', err);
      //     $scope.loading = false;
      //   })
      // })

      classroom.$remove();
      $scope.user.teacher = false;
      $state.go('home');
    }



  });
