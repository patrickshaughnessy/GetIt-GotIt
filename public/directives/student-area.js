'use strict';

angular
  .module('app')
  .directive('studentArea', function($window){

    var link = function(scope, elem, attrs){

      // create a circle for each student in the classroom
      // need # of students
      var students;

      var csize = [1000, 500]
      //  ,radius = 22;

      

      var svg = d3.select(elem[0]).append("svg")
        .attr({width: csize[0], height: csize[1]})
        .attr("viewBox", "0 0 " + csize[0] + " " + csize[1]);

      var cx = function(d, i){
        if (d.color == 'green'){
          return i * 150 + 500;
        } else {
          return i * 100 + 50;
        }
      }

      var cy = function(d, i){
        if (d.color == 'blue'){
          return 150;
        } else {
          return 50;
        }
      }

      var update = function(){
        students = angular.fromJson(scope.students).map(function(d){
          if (d.helpee){
            d.color = 'red';
            return d;
          } else if (d.helper){
            d.color = 'blue';
            return d;
          } else {
            d.color = 'green';
            return d;
          }
        });

        if (!students){
          return;
        }

        var circle = svg.selectAll('circle')
            .data(students);
        // circle.exit().remove();
        circle.enter().append('circle')
            .attr("r", 0)
          .transition()
            .attr("cy", function(d, i){
              return cy(d, i);
            })
            .attr("cx", function(d, i) {
              return cx(d, i);
            })
            .style('fill', function(d) { return d.color })
            .attr("r", 50);

        circle
            .attr("r", 0)
          .transition()
            .attr("cy", function(d, i){
              return cy(d, i);
            })
            .attr("cx", function(d, i) {
              return cx(d, i);
            })
            .attr("r", 50)
            .style('fill', function(d) { return d.color });

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
