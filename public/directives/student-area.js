'use strict';

angular
  .module('app')
  .directive('studentArea', function($window){

    var link = function(scope, elem, attrs){
      var students;

      console.log('window', $window.innerWidth, $window.innerHeight)

      var canvas = ['100', '100'],
          radius = '5%'

      var svg = d3.select(elem[0]).append("svg")
        .attr({width: canvas[0] + '%', height: canvas[1] + '%'})
        .attr("viewBox", "0 0 " + canvas[0] + " " + canvas[1]);



      var cx = function(d, i){
        if (d.color == 'green'){
          return i * 150 + 500;
        } else if (d.color == 'blue'){
          return i * 100 + 50;
        } else {
          return i * 100 + 100;
        }
      }

      var cy = function(d, i){
        if (d.color == 'blue'){
          return 300;
        } else if (d.color == 'red'){
          return 150;
        } else {
          return 50;
        }
      }

      var r = function(d, i){
        if (d.color == 'red'){
          return '20%';
        } else {
          return '10%';
        }
      }

      var cxGreen = function(d, i){
        var interval = Math.round(100/(students.length + 1));
        return ((i%5)+1) * interval;
      }

      var cyGreen = function(d, i){
        var numRows = Math.ceil(students.length/5);
        var interval = Math.round(100/(numRows + 1));
        var currentRow = Math.ceil((i+1)/5);
        return currentRow * interval;

      }

      var allGreenStudents = function(students){
        return students.every(function(student){
          return student.color == 'green';
        });
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

        if (allGreenStudents(students)){
          var circle = svg.selectAll('circle')
              .data(students);

          circle.enter().append('circle')
              .attr("r", 0)
            .transition()
              .attr("cy", function(d, i){
                return cyGreen(d, i);
              })
              .attr("cx", function(d, i) {
                return cxGreen(d, i);
              })
              .style('fill', function(d) { return d.color })
              .attr("r", function(d, i) {
                return r(d, i);
              });

          circle
              .attr("r", 0)
            .transition()
              .attr("cy", function(d, i){
                return cyGreen(d, i);
              })
              .attr("cx", function(d, i) {
                return cxGreen(d, i);
              })
              .attr("r", function(d, i) {
                return r(d, i);
              })
              .style('fill', function(d) { return d.color });

          circle.exit()
            .transition()
              .attr('r', 0)
              .remove();

          return;
        }

        // else mix of reds, blues, greens
        var circle = svg.selectAll('circle')
            .data(students);

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
            .attr("r", function(d, i) {
              return r(d, i);
            });

        circle
            .attr("r", 0)
          .transition()
            .attr("cy", function(d, i){
              return cy(d, i);
            })
            .attr("cx", function(d, i) {
              return cx(d, i);
            })
            .attr("r", function(d, i) {
              return r(d, i);
            })
            .style('fill', function(d) { return d.color });

        circle.exit()
          .transition()
            .attr('r', 0)
            .remove();


      }

      scope.$watch('students', update);

    }

    return {
      template: '<div class="studentCircles col-xs-12"></div>',
      replace: true,
      restrict: 'EA',
      scope: {
        students: '@'
      },
      link: link
    }
  })
