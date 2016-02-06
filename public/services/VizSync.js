'use strict';

angular
  .module('app')
  .service("VizSync", ["$firebaseArray, $firebaseObject", function($firebaseArray, $firebaseObject) {
      // var usersRef = new Firebase("https://getitgotit.firebaseio.com/users");
      // var users = $firebaseObject(usersRef);
      //
      // // update viz when student data changes in classroom
      // this.syncViz = function(uid, classID, studentKey){
      //   var studentsRef = new Firebase(`https://getitgotit.firebaseio.com/classrooms/${classID}/students`);
      //   var students = $firebaseArray(studentsRef);
      //   students.$loaded().then(function(){
      //     students[studentKey] = users;
      //   })
      //
      // }

    }
  ]);
