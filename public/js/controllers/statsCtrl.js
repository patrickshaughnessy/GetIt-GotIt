'use strict';

angular
  .module('app')
  .controller("statsCtrl", function(DataService, Auth, currentAuth, $state, $scope, $firebaseObject, $firebaseArray, $timeout, $interval) {

    moment().format();

    var userRef = new Firebase(`https://getitgotit.firebaseio.com/users/${currentAuth.uid}`);
    var user = $firebaseObject(userRef);
    user.$bindTo($scope, 'user');

    var classesDataRef = new Firebase(`https://getitgotit.firebaseio.com/users/${currentAuth.uid}/classesData`);

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

        $scope.duration = getTotalClassTime(classDataArray);

        $scope.classPoints = getTotalPoints(classDataArray);
      })

      function getTotalClassTime(data){
        var end = moment(data[data.length-1].time);
        var beginning = moment(data[0].time);
        return end.from(beginning, true);
      }

      function getTotalPoints(data){
        return data.reduce(function(most, snap){
          return snap.points && snap.points > most ? snap.points : most;
        }, 0)
      }

      function getLowComprehensionTimes(classSnap, threshold){

      }

      function getStudentStats(classSnap){



        var stats = {
          studentInfo: studentInfo(),
          totalTimeInClass: studentTotalTimeInClass(),
          helpeeTime: studentTimeAsHelpee(),
          helperTime: studentTimeAsHelper(),
          chatHistory: studentChatHistory(),
          avgComprehensionRate: studentAverageComprehensionRateForClass(),
          ratio: studentHelpeeHelperRatio()
        };

        function studentInfo(student){
          // get user data
        }

        function studentTotalTimeInClass(){

        }

        function studentTimeAsHelpee(){

        }

        function studentTimeAsHelper(){

        }

        function studentChatHistory(){

        }

        function studentAverageComprehensionRateForClass(){

        }

        function studentHelpeeHelperRatio(){

        }

        return stats;
      }

    }

  });
