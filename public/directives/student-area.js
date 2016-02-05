'use strict';

angular
  .module('app')
  .directive('studentArea', function($window){

    var link = function(scope, elem, attrs){
      var students;

      var width = $('.studentCirclesRow')[0].clientWidth;
      var height = $('.studentCirclesRow')[0].clientHeight;

      var canvas = [width, height],
          radius = '5'

      var svg = d3.select(elem[0])
      .append('svg')
        .attr({width: canvas[0], height: canvas[1]})
        .attr("viewBox", "0 0 " + 100 + " " + 100);
      svg.append('g');


      // .append('div')
      // .classed('svg-container', true)
      // .append("svg")
      // .attr('preserveAspectRatio', 'xMinYMin meet')
      // .attr('viewBox', '0 0 100 100')
      // .classed('svg-content-responsive', true)
      // .append('g');


      var cx = function(d, i){
        if (d.color == 'green'){
          var numRows = Math.ceil(students.length/5);
          var currentRow = Math.ceil((i+1)/5);
          var interval;
          if (students.length % 5 === 0 || currentRow !== numRows){
            interval = Math.round(50/6);
          } else {
            interval = Math.round(50/((students.length % 5) + 1));
          }
          return (((i%5)+1) * interval) + 50;
        } else if (d.color == 'blue'){
          var numRows = Math.ceil(students.length/5);
          var currentRow = Math.ceil((i+1)/5);
          var interval;
          if (students.length % 5 === 0 || currentRow !== numRows){
            interval = Math.round(50/6);
          } else {
            interval = Math.round(50/((students.length % 5) + 1));
          }
          return (((i%5)+1) * interval);
        } else {
          var numRows = Math.ceil(students.length/5);
          var currentRow = Math.ceil((i+1)/5);
          var interval;
          if (students.length % 5 === 0 || currentRow !== numRows){
            interval = Math.round(50/6);
          } else {
            interval = Math.round(50/((students.length % 5) + 1));
          }
          return (((i%5)+1) * interval);
        }
      }

      var cy = function(d, i){
        if (d.color == 'blue'){
          var numRows = Math.ceil(students.length/5);
          var interval = Math.round(100/(numRows + 1));
          var currentRow = Math.ceil((i+1)/5);
          return currentRow * interval;
        } else if (d.color == 'red'){
          var numRows = Math.ceil(students.length/5);
          var interval = Math.round(100/(numRows + 1));
          var currentRow = Math.ceil((i+1)/5);
          return currentRow * interval;
        } else {
          var numRows = Math.ceil(students.length/5);
          var interval = Math.round(100/(numRows + 1));
          var currentRow = Math.ceil((i+1)/5);
          return currentRow * interval;
        }
      }

      var r = function(d, i){
        if (d.color == 'red'){
          return radius*2;
        } else {
          return radius;
        }
      }

      var cxGreen = function(d, i){
        var numRows = Math.ceil(students.length/5);
        var currentRow = Math.ceil((i+1)/5);
        var interval;
        if (students.length % 5 === 0 || currentRow !== numRows){
          interval = Math.round(100/6);
        } else {
          interval = Math.round(100/((students.length % 5) + 1));
        }
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
          var circle = svg.select('g').selectAll('circle')
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
        var circle = svg.select('g').selectAll('circle')
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
      angular.element($window).bind('resize', function(){
        console.log('resizing');
        svg.attr('width', $('.studentCirclesRow')[0].clientWidth);
        svg.attr('height', $('.studentCirclesRow')[0].clientHeight);
        update();
      })

    }

    return {
      template: '<div class="studentCircles"></div>',
      replace: true,
      restrict: 'EA',
      scope: {
        students: '@'
      },
      link: link
    }
  })
