'use strict';

angular
  .module('app')
  .controller("statsCtrl", function(DataService, Auth, currentAuth, $state, $scope, $firebaseObject, $firebaseArray, $timeout, $interval) {

    var userRef = new Firebase(`https://getitgotit.firebaseio.com/users/${currentAuth.uid}`);
    var user = $firebaseObject(userRef);
    user.$bindTo($scope, 'user');

    var classesDataRef = new Firebase(`https://getitgotit.firebaseio.com/users/${currentAuth.uid}/classesData`);
    var classesData = $firebaseObject(classesDataRef);
    classesData.$bindTo($scope, 'classesData')

    classesDataRef.once('value', function(allClasses){

      var allClassesArray = [];
      allClasses.forEach(function(classSnap){
        allClassesArray.push(classSnap.val());
      })

      var totalStudentsArray = allClassesArray.map(function(classinfo){
        return classinfo.reduce(function(most, snap){
          return snap.students && snap.students.length > most ? snap.students.length : most;
        }, 0);
      });
      var totalStudentsTaught = totalStudentsArray.reduce(function(total, val){
        return total + val;
      },0);

      var avgCompArray = allClassesArray.map(function(classinfo){
        return Math.round(classinfo.reduce(function(total, snap){
          return total + snap.percentage;
        }, 0)/classinfo.length);
      });
      var avgComprehensionPerClass = avgCompArray.length ? Math.round(avgCompArray.reduce(function(total, val){
        return total + val;
      }, 0)/avgCompArray.length) : 0;

      var totalClasses = allClassesArray.length;

      var avgStudentsPerClass = totalClasses ? Math.round(totalStudentsTaught/totalClasses) : 0;

      $scope.averageStudentsPerClass = avgStudentsPerClass ? avgStudentsPerClass : '---';
      $scope.averageComprehensionPerClass = avgComprehensionPerClass ? avgComprehensionPerClass + '%' : '---';
      $scope.totalClasses = totalClasses ? totalClasses : '---';
      $scope.totalStudentsTaught = totalStudentsTaught ? totalStudentsTaught : '---';

    })

    $scope.showClassDetails = function(date){
      if (date === 'reset'){
        $scope.timeData = null;
        return;
      }
      $scope.classDate = date;

      var classDataRef = new Firebase(`https://getitgotit.firebaseio.com/users/${currentAuth.uid}/classesData/${date}`);
      $scope.timeData = $firebaseArray(classDataRef);

      $scope.timeData.$loaded().then(function(){

        $scope.totalStudents = $scope.timeData.reduce(function(most, snap){
          return snap.students && snap.students.length > most ? snap.students.length : most;
        }, 0)

        $scope.avgComp = Math.round($scope.timeData.reduce(function(total, snap){
          return total + snap.percentage;
        }, 0)/$scope.timeData.length);

      })

    }

  });
