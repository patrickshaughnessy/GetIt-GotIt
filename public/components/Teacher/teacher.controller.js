'use strict';

angular
  .module('app')
  .controller("teacherCtrl", function(Auth, currentAuth, $state, $scope, $firebaseObject, $firebaseArray, $timeout, $interval) {

    $scope.classID = $state.params.classID;

    var isChrome = !!window.chrome && !!window.chrome.webstore;

    var classDataRef = new Firebase(`https://ch-getitgotit.firebaseio.com/users/${currentAuth.uid}/classesData/${$state.params.classID}`);
    var classData = $firebaseObject(classDataRef);
    classData.$bindTo($scope, 'classData').then(function(){
      if (!$scope.classData.time){
        $scope.classData.time = Date.now();
      }
    })

    var dataRef = new Firebase(`https://ch-getitgotit.firebaseio.com/users/${currentAuth.uid}/classesData/${$state.params.classID}/data`);
    $scope.timeData = $firebaseArray(dataRef);

    var userRef = new Firebase(`https://ch-getitgotit.firebaseio.com/users/${currentAuth.uid}`);
    var user = $firebaseObject(userRef);
    user.$bindTo($scope, 'user');

    var classroomRef = new Firebase(`https://ch-getitgotit.firebaseio.com/classrooms/${$state.params.classID}`);
    var classroom = $firebaseObject(classroomRef);
    classroom.$bindTo($scope, 'classroom');

    var studentsRef = new Firebase(`https://ch-getitgotit.firebaseio.com/classrooms/${$state.params.classID}/students`);
    $scope.students = $firebaseArray(studentsRef);

    var updatePercentage = function(){
      if ($scope.students.length){
        var grays = $scope.students.filter(student => student.color === 'gray').length;
        var greens = $scope.students.filter(student => student.color === 'green').length;
        var yellows = $scope.students.filter(student => student.color === 'yellow').length;
        var reds = $scope.students.filter(student => student.color === 'red').length;

        var totalStudents = grays + greens + yellows + reds;

        var percentage = (greens + yellows*0.5)/(greens + yellows + reds) || 0;
        var neutral = grays/(greens + yellows + reds);

        if (neutral > 0){
          document.querySelectorAll("link[rel*='icon'")[0].setAttribute('href', "assets/graycircle.ico");
          $scope.percentage = '...';
        } else {
          var green, yellow, red;
          $scope.percentage = Math.round(percentage * 100);
          if ($scope.percentage > 80 && !green && isChrome){
            document.querySelectorAll("link[rel*='icon'")[0].setAttribute('href', "assets/greencircle.ico");
            green = true;
            yellow = false;
            red = false;
          } else if ($scope.percentage > 60 && !yellow && isChrome){
            document.querySelectorAll("link[rel*='icon'")[0].setAttribute('href', "assets/yellowcircle.ico");
            green = false;
            yellow = true;
            red = false;
          } else if ($scope.percentage <= 60 && !red && isChrome){
            document.querySelectorAll("link[rel*='icon'")[0].setAttribute('href', "assets/redcircle.ico");
            green = false;
            yellow = false;
            red = true;
          }
        }
      }
    }

    $scope.students.$watch(function(e){
      updatePercentage();
    });


    // track realtime classroom data over time
    $scope.isRecording;
    $scope.startRecording = function(){
      $scope.isRecording = $interval(function(){
        var info = {
          time: Date.now(),
          percentage: (!$scope.percentage || $scope.percentage == '...') ? 0 : $scope.percentage,
          students: $scope.students || null
        };
        $scope.timeData.$add(info);
      }, 1000)
    }

    $scope.pauseRecording = function(){
      if (!$scope.isRecording) return;
      $interval.cancel($scope.isRecording);
      $scope.isRecording = undefined;
    }


    $scope.endClass = function(){

      if ($scope.isRecording){
        $interval.cancel($scope.isRecording);
      }
      $scope.user.teacher = null;

      classroom.$remove().then(function(){
        $state.go('home');
      });

      if (isChrome){
        document.querySelectorAll("link[rel*='icon'")[0].setAttribute('href', "assets/greencircle.ico");
      }

    }



  });
