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


      var getFillColor = function(d){
        var color = 'green';
        if (d.helpee){
          color = 'red';
        } else if (d.helper) {
          color = 'blue';
        }
        return color;
      }

      var allStudentsGreen = function(students){
        return students.every(function(student){
          return !student.helpee && !student.helper
        });
      }

      var someRed = function(students){
        var noHelpers = students.every(function(student){
          return !student.helper;
        });

        if (noHelpers){
          return students.some(function(student){
            return student.helpee;
          })
        }
        return noHelpers;
      }

      var renderGreenView = function(students){
        var circle = svg.selectAll("circle")
          .data(students)
          .attr("cy", 50)
          .attr("cx", function(d, i) { return i * 200 + 50; })
          .attr("r", 50)
          .style('fill', function(d, i) { return getFillColor(d)});

        circle.enter().append("circle")
            .attr("cy", 50)
            .attr("cx", function(d, i) { return i * 200 + 50; })
            .attr("r", 50)
            .style('fill', function(d, i) { return getFillColor(d)});

        circle.exit().remove();
      }

      var renderRedAndGreenView = function(students){

      }

      var update = function(){
        // students = scope.students;
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
        console.log(students);
        var circle = svg.selectAll('circle')
            .data(students);
        circle.exit().remove();
        circle.enter().append('circle')
            .attr("cy", 50)
            .attr("cx", function(d, i) { console.log(i); return i * 100 + 50; })
            .attr("r", 50)
            .style('fill', function(d) { return d.color });
        circle
            .attr("cy", 50)
            .attr("cx", function(d, i) { console.log(i); return i * 100 + 50; })
            .attr("r", 50)
            .style('fill', function(d) { return d.color });

        // if (allStudentsGreen(students)){
        //   renderGreenView(students);
        //   return;
        // }
        //
        // if (someRed(students)){
        //   renderRedAndGreenView(students);
        //   return;
        // }


        // var circle = svg.selectAll('circle').remove();
        // var circle = svg.selectAll("circle")
        //   .data(students)
        //   .attr("cy", 50)
        //   .attr("cx", function(d, i) { return i * 100 + 50; })
        //   .attr("r", 50)
        //   .style('fill', function(d, i) { return getFillColor(d)});
        //
        // circle.enter().append("circle")
        //     .attr("cy", 50)
        //     .attr("cx", function(d, i) { return i * 100 + 50; })
        //     .attr("r", 50)
        //     .style('fill', function(d, i) { return getFillColor(d)});
        //
        // circle.exit().remove();
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
