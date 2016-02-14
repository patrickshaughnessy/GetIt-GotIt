'use strict';

angular
  .module('app')
  .controller("statsCtrl", function(DataService, Auth, currentAuth, $state, $scope, $firebaseObject, $firebaseArray, $timeout, $interval) {

    moment().format();

    var usersRef = new Firebase(`https://getitgotit.firebaseio.com/users`);

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
        $scope.showNone = true;
        $scope.studentStats = undefined;
        return;
      }
      $scope.studentStats = undefined;
      $scope.showNone = false;


      classesDataRef.child(id).once('value', function(classData){
        $scope.currentClassTime = classData.val().time;

        var chatrooms = classData.val().chatrooms;
        var chatroomsArray = [];
        for (var key in chatrooms){
          chatroomsArray.push(chatrooms[key]);
        }
        $scope.chatrooms = chatroomsArray;

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

        $scope.studentList = getStudentList(classDataArray);

        $scope.viewStudentStats = function(studentID){
          $scope.studentStats = getStudentStats(studentID, classDataArray, $scope.studentList, chatroomsArray);
        }

      })

      function getTotalClassTime(data){
        var end = moment( d3.max(data, function(d){ return d.time }) );
        var beginning = moment( d3.min(data, function(d){ return d.time }) );
        return end.from(beginning, true);
      }

      function getTotalPoints(data){
        return data.reduce(function(most, snap){
          return snap.points && snap.points > most ? snap.points : most;
        }, 0)
      }

      function getLowComprehensionTimes(classSnap, threshold){

      }

      function getStudentList(data){
        var list = {};

        data.forEach(function(snap){
          if (snap.students){
            for (var idx in snap.students){
              if (!list[snap.students[idx].id]){
                list[snap.students[idx].id] = snap.students[idx]
              }
            }
          }
        });

        return list;
      }

      function getStudentStats(studentID, data, studentList, chatroomsArray){

        var studentInfo = studentList[studentID];

        var studentSnaps = data.filter(function(snap){
          return snap.students ? snap.students.some(function(s){
            return s.id === studentID
          }) : false;
        }).map(function(snap){
          var student = snap.students.find(function(s){
            return s.id === studentID;
          });
          var time = snap.time;

          var chatrooms = snap.chatrooms ? snap.chatrooms.find(function(s){
            return s.helpee === studentID || s.helper === studentID
          }) : null;

          var percentage = snap.percentage || null;

          var points = snap.points || null;

          return {
            student: student,
            time: time,
            percentage: percentage,
            points: points,
            chatrooms: chatrooms
          };
        })

        var stats = {
          studentInfo: {
            avatar: studentInfo.avatar,
            name: studentInfo.name,
            id: studentInfo.id
          },
          totalTimeInClass: getTotalClassTime(studentSnaps),
          helpeeTime: studentTimeAsHelpee(studentSnaps),
          helperTime: studentTimeAsHelper(studentSnaps),
          chatHistory: studentChatHistory(chatroomsArray),
          avgComprehensionRate: studentAverageComprehensionRateForClass(studentSnaps),
        };

        function studentTimeAsHelpee(studentSnaps){
          var helpeeTimeArray = studentSnaps.filter(function(snap){
            return snap.student.helpee;
          });

          // * 1000 to convert snap of length 1 second to milliseconds
          var helpeeTime = moment.duration(helpeeTimeArray.length*1000)

          return helpeeTime.humanize()
        }

        function studentTimeAsHelper(studentSnaps){
          var helperTimeArray = studentSnaps.filter(function(snap){
            return snap.student.helper;
          });

          // * 1000 to convert snap of length 1 second to milliseconds
          var helperTime = moment.duration(helperTimeArray.length*1000)

          return helperTime.humanize()
        }

        function studentChatHistory(chatroomsArray){
          var helpeeChats = chatroomsArray.filter(function(snap){
            return snap.helper === studentID
          });
          var helperChats = chatroomsArray.filter(function(snap){
            return snap.helper === studentID
          });

          return {
            helpeeChats: helpeeChats,
            helperChats: helperChats
          }
        }

        function studentAverageComprehensionRateForClass(data){
          var helpeeTimeArray = studentSnaps.filter(function(snap){
            return snap.student.helpee;
          });
          return Math.round(((data.length - helpeeTimeArray.length)/data.length)*100) + '%';
        }

        return stats;
      }

    }

  });
