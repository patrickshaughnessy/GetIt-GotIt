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
        svg.append('g');


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

      var cxLeft = function(d, i, g){
        // total colums for greens on left;
        var columns = Math.ceil(g.length/5);

        // width of left area is width/3
        var interval = Math.round((width/3)/(columns + 1));

        // current column for circle
        var currentColumn = Math.ceil((i+1)/5);

        // location is the current column of circle in the left area
        return currentColumn * interval;
      }
      var cyLeft = function(d, i, g){
        // total colums for greens on left
        var columns = Math.ceil(g.length/5);

        // current column for circle
        var currentColumn = Math.ceil((i+1)/5);

        var interval;
        if (g.length % 5 === 0 || currentColumn !== columns){
          // 1) total greens on left is divisible by 5 or circle is in a row of 5
          interval = Math.round((height)/6);
        } else {
          // 2) circle is in a row with less than 5, space evenly
          interval = Math.round((height)/((g.length % 5) + 1));
        }

        // interval calculated based on index
        return (((i%5)+1) * interval);
      }
      var cxRight = function(d, i, g){
        // total colums for greens on right;
        var columns = Math.ceil(g.length/5);

        // width of right area is width/3
        var interval = Math.round((width/3)/(columns + 1));

        // current column for circle
        var currentColumn = Math.ceil((i+1)/5);

        // location is the current column of circle, offset by 2/3 width
        return (currentColumn * interval) + (2*width)/3;
      }
      var cyRight = function(d, i, g){
        // total colums for greens on right - same as left?
        var columns = Math.ceil(g.length/5);

        // current column for circle
        var currentColumn = Math.ceil((i+1)/5);

        var interval;
        if (g.length % 5 === 0 || currentColumn !== columns){
          // 1) total greens on right is divisible by 5 or circle is in a row of 5
          interval = Math.round((height)/6);
        } else {
          // 2) circle is in a row with less than 5, space evenly
          interval = Math.round((height)/((g.length % 5) + 1));
        }

        // interval calculated based on index
        return (((i%5)+1) * interval);
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
      var getBlueCoords = function(d, i, s){
        return {x: cx(d, i, s), y: cy(d, i, s)};
      }
      var getGreenCoords = function(d, i, g){
        // split into left & right greens based on index
        return (i%2 === 0) ? {x: cxLeft(d, i, g), y: cyLeft(d, i, g)} : {x: cxRight(d, i, g), y: cyRight(d, i, g)};
      }

      var update = function(){
        updateCanvas();


        var students = angular.fromJson(scope.students)

        if (allGreenStudents(students)){
          // all green students = return evenly distributed
          students = students.map(function(d, i, s){
            d.color = 'green';
            d.coords = getAllGreenCoords(d, i, s);
            return d;
          });
        } else {
          // mix of reds, blues, greens
          // first separate all

          var greens = students
            .filter(function(s){
              return !s.helper && !s.helpee;
            }).map(function(d, i, g){
              d.color = 'green';
              d.coords = getGreenCoords(d, i, g);
              return d
            });

          var reds = students
            .filter(function(s){
              return s.helpee;
            })
            .map(function(d, i, r){
              d.color = 'red';
              d.coords = getRedCoords(d, i, r);
              return d;
            });

          var blues = students
            .filter(function(s){
              return s.helper;
            })
            .map(function(d, i, b){
              d.color = 'blue';
              d.coords = getBlueCoords(d, i, b);
              return d;
            });

          // concat to array of students;
          students = greens.concat(reds, blues);
        }

        // .map(function(d, i, s){
        //     if (d.helpee){
        //       d.color = 'red';
        //       d.coords = getRedCoords(d, i, s);
        //     } else if (d.helper){
        //       d.color = 'blue';
        //       d.coords = getBlueCoords(d, i, s);
        //     } else {
        //       d.color = 'green';
        //       d.coords = getGreenCoords(d, i, s);
        //     }
        //     return d;
        //   }
        // });

        if (!students){
          return;
        }

        var width = $('.studentCirclesRow')[0].clientWidth;
        var height = $('.studentCirclesRow')[0].clientHeight;

        var canvas = [width, height],
            radius = width/10;

        svg.attr({width: canvas[0], height: canvas[1]});

        var circle = svg.select('g').selectAll('circle')
        // var circle = svg.selectAll('circle')
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
