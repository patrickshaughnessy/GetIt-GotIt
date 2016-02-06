'use strict';

angular
  .module('app')
  .directive('studentCircles', function($window){

    var link = function(scope, elem, attrs){
      var width = $('.studentCirclesRow')[0].clientWidth;
      var height = $('.studentCirclesRow')[0].clientHeight;
      var radius = width/20;

      var updateCanvas = function(){
        width = $('.studentCirclesRow')[0].clientWidth;
        height = $('.studentCirclesRow')[0].clientHeight;
        radius = width/20;
      }


      var canvas = [width, height];

      var svg = d3.select(elem[0])
        .append('svg')
          .attr({width: width, height: height});
          // .attr("viewBox", "0 0 " + 100 + " " + 100);
        // svg.append('g');


      // .append('div')
      // .classed('svg-container', true)
      // .append("svg")
      // .attr('preserveAspectRatio', 'xMinYMin meet')
      // .attr('viewBox', '0 0 100 100')
      // .classed('svg-content-responsive', true)
      // .append('g');


      var cx = function(d, i, s){
        if (d.color == 'green'){
          var numRows = Math.ceil(s.length/5);
          var currentRow = Math.ceil((i+1)/5);
          var interval;
          if (s.length % 5 === 0 || currentRow !== numRows){
            interval = Math.round((width/2)/6);
          } else {
            interval = Math.round((width/2)/((s.length % 5) + 1));
          }
          return (((i%5)+1) * interval) + 50;
        } else if (d.color == 'blue'){
          var numRows = Math.ceil(s.length/5);
          var currentRow = Math.ceil((i+1)/5);
          var interval;
          if (s.length % 5 === 0 || currentRow !== numRows){
            interval = Math.round(50/6);
          } else {
            interval = Math.round((width/2)/((s.length % 5) + 1));
          }
          return (((i%5)+1) * interval);
        } else {
          var numRows = Math.ceil(s.length/5);
          var currentRow = Math.ceil((i+1)/5);
          var interval;
          if (s.length % 5 === 0 || currentRow !== numRows){
            interval = Math.round((width/2)/6);
          } else {
            interval = Math.round((width/2)/((s.length % 5) + 1));
          }
          return (((i%5)+1) * interval);
        }
      }

      var cy = function(d, i, s){
        if (d.color == 'blue'){
          var numRows = Math.ceil(s.length/5);
          var interval = Math.round(height/(numRows + 1));
          var currentRow = Math.ceil((i+1)/5);
          return currentRow * interval;
        } else if (d.color == 'red'){
          var numRows = Math.ceil(s.length/5);
          var interval = Math.round(height/(numRows + 1));
          var currentRow = Math.ceil((i+1)/5);
          return currentRow * interval;
        } else {
          var numRows = Math.ceil(s.length/5);
          var interval = Math.round(height/(numRows + 1));
          var currentRow = Math.ceil((i+1)/5);
          return currentRow * interval;
        }
      }

      var r = function(d, i, s){
        if (d.color == 'red'){
          return radius*2;
        } else {
          return radius;
        }
      }

      var cxGreen = function(d, i, s){
        var numRows = Math.ceil(s.length/5);
        var currentRow = Math.ceil((i+1)/5);
        var interval;
        if (s.length % 5 === 0 || currentRow !== numRows){
          interval = Math.round(width/6);
        } else {
          interval = Math.round(width/((s.length % 5) + 1));
        }
        return ((i%5)+1) * interval;
      }

      var cyGreen = function(d, i, s){
        var numRows = Math.ceil(s.length/5);
        var interval = Math.round(height/(numRows + 1));
        var currentRow = Math.ceil((i+1)/5);
        return currentRow * interval;

      }

      var allGreenStudents = function(students){
        return students.every(function(student){
          return !student.helpee && !student.helper;
        });
      }

      var getAllGreenCoords = function(d, i, s){
        return {x: cxGreen(d, i, s), y: cyGreen(d, i, s)}
      }

      var getRedCoords = function(d, i, s){
        return {x: cx(d, i, s), y: cy(d, i, s)};
      }
      var getGreenCoords = function(d, i, s){
        return {x: cx(d, i, s), y: cy(d, i, s)};
      }
      var getBlueCoords = function(d, i, s){
        return {x: cx(d, i, s), y: cy(d, i, s)};
      }

      var update = function(){
        // need to know:
        // 1) all green students? - do an all green even layout
        // 2) not all green, some red, some blues
        //  - cluster greens together
        //  - cluster reds together w/ their blue if applicable

        updateCanvas();

        var students = angular.fromJson(scope.students).map(function(d, i, s){
          // 1) all green
          if (allGreenStudents(s)){
            d.color = 'green';
            d.coords = getAllGreenCoords(d, i, s);
            return d;
          } else {
            if (d.helpee){
              d.color = 'red';
              d.coords = getRedCoords(d, i, s);
            } else if (d.helper){
              d.color = 'blue';
              d.coords = getBlueCoords(d, i, s);
            } else {
              d.color = 'green';
              d.coords = getAllGreenCoords(d, i, s);
            }
            return d;
          }
        });

        if (!students){
          return;
        }

        var width = $('.studentCirclesRow')[0].clientWidth;
        var height = $('.studentCirclesRow')[0].clientHeight;

        var canvas = [width, height],
            radius = width/10;

        svg.attr({width: canvas[0], height: canvas[1]});

        // var circle = svg.select('g').selectAll('circle')
        var circle = svg.selectAll('circle')
            .data(students);

        circle.enter().append('circle')
            .attr("r", 0)
          .transition()
            .attr("cy", function(d, i){ return d.coords.y})
            .attr("cx", function(d, i) { return d.coords.x})
            .style('fill', function(d) { return d.color })
            .attr("r", function(d, i) {
              return r(d, i);
            });

        circle
            .attr("r", 0)
          .transition()
            .attr("cy", function(d, i){ return d.coords.y })
            .attr("cx", function(d, i) { return d.coords.x })
            .attr("r", function(d, i) {
              return r(d, i);
            })
            .style('fill', function(d) { return d.color });

        circle.exit()
          .transition()
            .attr('r', 0)
            .remove();

        // // else mix of reds, blues, greens
        // var circle = svg.select('g').selectAll('circle')
        //     .data(students);
        //
        // circle.enter().append('circle')
        //     .attr("r", 0)
        //   .transition()
        //     .attr("cy", function(d, i){
        //       return cy(d, i);
        //     })
        //     .attr("cx", function(d, i) {
        //       return cx(d, i);
        //     })
        //     .style('fill', function(d) { return d.color })
        //     .attr("r", function(d, i) {
        //       return r(d, i);
        //     });
        //
        // circle
        //     .attr("r", 0)
        //   .transition()
        //     .attr("cy", function(d, i){
        //       return cy(d, i);
        //     })
        //     .attr("cx", function(d, i) {
        //       return cx(d, i);
        //     })
        //     .attr("r", function(d, i) {
        //       return r(d, i);
        //     })
        //     .style('fill', function(d) { return d.color });
        //
        // circle.exit()
        //   .transition()
        //     .attr('r', 0)
        //     .remove();


      }

      scope.$watch('students', update);
      angular.element($window).bind('resize', function(){
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
