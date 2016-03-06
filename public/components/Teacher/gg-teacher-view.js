angular.module('app')
.directive('ggTeacherView', function($state, $firebaseObject, $firebaseArray, $timeout, $interval){

  function link(scope, elem, attrs){

    function update(){
      if (!scope.auth) return;

      console.log(elem[0])

      var classroomRef = new Firebase(`https://ch-getitgotit.firebaseio.com/classrooms/static`);
      var classroom = $firebaseObject(classroomRef);
      classroom.$bindTo(scope, 'classroom');

      var studentsRef = new Firebase(`https://ch-getitgotit.firebaseio.com/classrooms/static/students`);
      scope.students = $firebaseArray(studentsRef);

      var updatePercentage = function(){
        if (scope.students.length){
          var grays = scope.students.filter(student => student.color === 'gray').length;
          var greens = scope.students.filter(student => student.color === 'green').length;
          var yellows = scope.students.filter(student => student.color === 'yellow').length;
          var reds = scope.students.filter(student => student.color === 'red').length;

          var totalStudents = grays + greens + yellows + reds;

          var percentage = (greens + yellows*0.5)/(greens + yellows + reds) || 0;
          var neutral = grays/(greens + yellows + reds);

          if (neutral > 0){
            document.querySelectorAll("link[rel*='icon'")[0].setAttribute('href', "assets/graycircle.ico");
            scope.percentage = '...';
          } else {
            var green, yellow, red;
            scope.percentage = Math.round(percentage * 100);
            if (scope.percentage > 80 && !green){
              document.querySelectorAll("link[rel*='icon'")[0].setAttribute('href', "assets/greencircle.ico");
              green = true;
              yellow = false;
              red = false;
            } else if (scope.percentage > 60 && !yellow){
              document.querySelectorAll("link[rel*='icon'")[0].setAttribute('href', "assets/yellowcircle.ico");
              green = false;
              yellow = true;
              red = false;
            } else if (scope.percentage <= 60 && !red){
              document.querySelectorAll("link[rel*='icon'")[0].setAttribute('href', "assets/redcircle.ico");
              green = false;
              yellow = false;
              red = true;
            }
          }
        }
      }

      scope.students.$watch(function(e){
        updatePercentage();
      });


      // track realtime classroom data over time
      scope.isRecording;
      scope.startRecording = function(){
        var dataRef = new Firebase(`https://ch-getitgotit.firebaseio.com/users/${angular.fromJson(scope.auth).uid}/static/data/${Date.now()}`);
        scope.timeData = $firebaseArray(dataRef);

        scope.isRecording = $interval(function(){
          var info = {
            time: Date.now(),
            percentage: (!scope.percentage || scope.percentage == '...') ? 0 : scope.percentage,
            students: scope.students || null
          };
          scope.timeData.$add(info);
        }, 1000)
      }

      scope.stopRecording = function(){
        if (!scope.isRecording) return;
        $interval.cancel(scope.isRecording);
        scope.isRecording = undefined;
      }

      scope.clearStudents = function(){
        if (scope.isRecording){
          $interval.cancel(scope.isRecording);
        }

        classroom.$remove();

        document.querySelectorAll("link[rel*='icon'")[0].setAttribute('href', "assets/greencircle.ico");

      }

    }

    scope.$watch('currentAuth', update);

  }


  return {
    templateUrl: 'partials/gg-teacher-view.html',
    replace: true,
    restrict: 'EA',
    scope: {
      auth: '@'
    },
    link: link
  }
});
