'use strict';

angular
  .module('app')
  .controller("statsCtrl", function(DataService, Auth, currentAuth, $state, $scope, $firebaseObject, $firebaseArray, $timeout, $interval) {

    var userRef = new Firebase(`https://getitgotit.firebaseio.com/users/${currentAuth.uid}`);
    var user = $firebaseObject(userRef);
    user.$bindTo($scope, 'user');

    var classesDataRef = new Firebase(`https://getitgotit.firebaseio.com/users/${currentAuth.uid}/classesData`);
    // var classesData = $firebaseObject(classesDataRef);
    // classesData.$bindTo($scope, 'classesData')

    classesDataRef.once('value', function(allClasses){

      var allClassesArray = [];

      allClasses.forEach(function(classData){
        var data = classData.val().data;
        var time = classData.val().time;

        var classDataArray = [];
        for (var key in data){
          classDataArray.push(data[key]);
        }

        allClassesArray.push({
          time: time,
          data: classDataArray,
          id: classData.key()
        });
      });

      $scope.classesData = allClassesArray;
      console.log($scope.classesData)

      var totalStudentsArray = allClassesArray.map(function(classinfo){
        return classinfo.data.reduce(function(most, snap){
          return snap.students && snap.students.length > most ? snap.students.length : most;
        }, 0);
      });
      var totalStudentsTaught = totalStudentsArray.reduce(function(total, val){
        return total + val;
      },0);

      var avgCompArray = allClassesArray.map(function(classinfo){
        return Math.round(classinfo.data.reduce(function(total, snap){
          return total + snap.percentage;
        }, 0)/classinfo.data.length);
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

    $scope.showNone = true;
    $scope.showClassDetails = function(id){
      if (id === 'reset'){
        return $scope.showNone = true;
      }
      $scope.showNone = false;

      classesDataRef.child(id).once('value', function(classData){
        $scope.currentClassTime = classData.val().time;

        var data = classData.val().data;
        var classDataArray = [];
        for (var key in data){
          classDataArray.push(data[key]);
        }
        $scope.currentClassData = classDataArray;

        $scope.totalStudents = classDataArray.reduce(function(most, snap){
          return snap.students && snap.students.length > most ? snap.students.length : most;
        }, 0)

        $scope.avgComp = Math.round(classDataArray.reduce(function(total, snap){
          return total + snap.percentage;
        }, 0)/classDataArray.length);

      })

    }

  });
