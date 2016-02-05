'use strict';

angular
  .module('app')
  .directive('studentArea', function($window){

    var link = function(scope, elem, attrs){

      // create a circle for each student in the classroom
      // need # of students
      var students;

      var csize = [500, 300]
      //  ,radius = 22;
      //
      var svg = d3.select(elem[0]).append("svg")
        .attr({width: csize[0], height: csize[1]})
        .attr("viewBox", "0 0 " + csize[0] + " " + csize[1]);



      var update = function(){
        students = scope.students;
        console.log('students', students);

        var data = Array(+students).fill(1);

        if (!students){
          return;
        }

        var circle = svg.selectAll("circle")
            .data(data);

        circle.enter().append("circle")
            .attr("cy", 50)
            .attr("cx", function(d, i) { return i * 100 + 50; })
            .attr("r", 50)

        circle.exit().remove();
      }

      scope.$watch('students', update);

    }

    return {
      template: '<div class="chart col-xs-12"></div>',
      replace: true,
      restrict: 'EA',
      scope: {
        students: '@'
      },
      link: link
    }
  })
