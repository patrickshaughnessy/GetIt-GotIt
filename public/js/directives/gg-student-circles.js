'use strict';

angular
  .module('app')
  .directive('ggStudentCircles', function($window){

    var link = function(scope, elem, attrs){

      var width = $('.teacherClassroomArea')[0].clientWidth;
      var height = $('.teacherClassroomArea')[0].clientHeight - $('.timeDataArea')[0].clientHeight;

      // height = height - height*0.2;

      var svg = d3.select(elem[0])
        .append('svg')
          .attr({width: width, height: height});
      svg.append('rect')
          .attr('id', 'graybg')
          .attr('width', width/2)
          .attr('height', height/2)
          .attr('fill', 'lightgray')
      svg.append('rect')
          .attr('id', 'greenbg')
          .attr('width', width/2)
          .attr('height', height/2)
          .attr('x', width/2)
          .attr('y', 0)
          .attr('fill', '#5cb85c')
      svg.append('rect')
          .attr('id', 'yellowbg')
          .attr('width', width/2)
          .attr('height', height/2)
          .attr('x', 0)
          .attr('y', height/2)
          .attr('fill', '#f0ad4e')
      svg.append('rect')
          .attr('id', 'redbg')
          .attr('width', width/2)
          .attr('height', height/2)
          .attr('x', width/2)
          .attr('y', height/2)
          .attr('fill', '#d9534f')
      svg.append('text')
          .attr('id', 'grayNum')
          .attr('x', width*0.25)
          .attr('y', height*0.05)
      svg.append('text')
          .attr('id', 'greenNum')
          .attr('x', width*0.75)
          .attr('y', height*0.05)
      svg.append('text')
          .attr('id', 'yellowNum')
          .attr('x', width*0.25)
          .attr('y', height*0.55)
      svg.append('text')
          .attr('id', 'redNum')
          .attr('x', width*0.75)
          .attr('y', height*0.55)
      svg.append('g')


      //////////////////////
      // Calculate Grays  //
      //////////////////////

      var getGrayCoords = function(d, i, a){
        return {x: cxGray(d, i, a), y: cyGray(d, i, a)}
      }

      var cxGray = function(d, i, a){
        var numRows = Math.ceil(a.length/5);
        var currentRow = Math.ceil((i+1)/5);
        var interval;
        if (a.length % 5 === 0 || currentRow !== numRows){
          // interval = Math.round(width/6);
          interval = Math.round(width/12);
        } else {
          interval = Math.round(width/(2*((a.length % 5) + 1)));
        }
        return ((i%5)+1) * interval;
      }

      var cyGray = function(d, i, a){
        var numRows = Math.ceil(a.length/5);
        // for full height, interval = height / rows so half height, change to half
        var interval = Math.round(height/(2 * (numRows + 1)));
        var currentRow = Math.ceil((i+1)/5);
        return currentRow * interval;
      }

      var crGray = function(d, i, a){
        return width/40;
      }

      ////////////////////////////
      // Calculate Green Coords //
      ////////////////////////////

      var getGreenCoords = function(d, i, g){
        return {x: cxGreen(d, i, g), y: cyGreen(d, i, g)}
      }

      var cxGreen = function(d, i, g){
        var numRows = Math.ceil(g.length/5);
        var currentRow = Math.ceil((i+1)/5);
        var interval;
        if (g.length % 5 === 0 || currentRow !== numRows){
          // interval = Math.round(width/6);
          interval = Math.round(width/12);
        } else {
          interval = Math.round(width/(2*((g.length % 5) + 1)));
        }
        return (((i%5)+1) * interval) + width/2;
      }

      var cyGreen = function(d, i, g){
        var numRows = Math.ceil(g.length/5);
        // for full height, interval = height / rows so half height, change to half
        var interval = Math.round(height/(2 * (numRows + 1)));
        var currentRow = Math.ceil((i+1)/5);
        return currentRow * interval;
      }

      var crGreen = function(d, i, g){

        return width/40;
      }

      /////////////////////////////
      // Calculate Yellow Coords //
      /////////////////////////////

      var getYellowCoords = function(d, i, y){
        return {x: cxYellow(d, i, y), y: cyYellow(d, i, y)}
      }

      var cxYellow = function(d, i, y){
        var numRows = Math.ceil(y.length/5);
        var currentRow = Math.ceil((i+1)/5);
        var interval;
        if (y.length % 5 === 0 || currentRow !== numRows){
          // interval = Math.round(width/6);
          interval = Math.round(width/12);
        } else {
          interval = Math.round(width/(2*((y.length % 5) + 1)));
        }
        return (((i%5)+1) * interval);
      }

      var cyYellow = function(d, i, y){
        var numRows = Math.ceil(y.length/5);
        // for full height, interval = height / rows so half height, change to half
        var interval = Math.round(height/(2 * (numRows + 1)));
        var currentRow = Math.ceil((i+1)/5);
        return (currentRow * interval) + height/2;
      }

      var crYellow = function(d, i, y){
        return width/40;
      }

      //////////////////////////
      // Calculate Red Coords //
      //////////////////////////

      var getRedCoords = function(d, i, r){
        return {x: cxRed(d, i, r), y: cyRed(d, i, r)}
      }

      var cxRed = function(d, i, r){
        var numRows = Math.ceil(r.length/5);
        var currentRow = Math.ceil((i+1)/5);
        var interval;
        if (r.length % 5 === 0 || currentRow !== numRows){
          // interval = Math.round(width/6);
          interval = Math.round(width/12);
        } else {
          interval = Math.round(width/(2*((r.length % 5) + 1)));
        }
        return (((i%5)+1) * interval) + width/2;
      }

      var cyRed = function(d, i, r){
        var numRows = Math.ceil(r.length/5);
        var interval = Math.round(height/(2 * (numRows + 1)));
        var currentRow = Math.ceil((i+1)/5);
        return (currentRow * interval) + height/2;
      }

      var crRed = function(d, i, r){
        return width/40;
      }

      /////////////////////////////
      // Update Background Color //
      /////////////////////////////

      var updateBG = function(percentage){

      }

      //////////////////////
      // Receive New Data //
      //////////////////////

      var update = function(){

        width = $('.teacherClassroomArea')[0].clientWidth;
        height = $('.teacherClassroomArea')[0].clientHeight - $('.timeDataArea')[0].clientHeight;
        console.log(width, height);
        if (!scope.students){
          return;
        }

        var students = angular.fromJson(scope.students);


        // separate students by color
        var greens = students
          .filter(function(s){
            return s.color === 'green'
          }).map(function(d, i, g){
            d.color = 'green';
            d.coords = getGreenCoords(d, i, g);
            d.radius = crGreen(d, i, g)
            return d
          });

        var reds = students
          .filter(function(s){
            return s.color === 'red';
          })
          .map(function(d, i, r){
            d.color = 'red';
            d.coords = getRedCoords(d, i, r);
            d.radius = crRed(d, i, r);
            return d;
          });

        var yellows = students
          .filter(function(s){
            return s.color === 'yellow';
          }).map(function(d, i, y){
            d.color = 'yellow';
            d.coords = getYellowCoords(d, i, y);
            d.radius = crYellow(d, i, y);
            return d;
          });

        var grays = students
          .filter(function(s){
            return s.color === 'gray';
          }).map(function(d, i, a){
            d.color = 'gray';
            d.coords = getGrayCoords(d, i, a);
            d.radius = crGray(d, i, a);
            return d;
          });

        // concat to array of students;
        students = greens.concat(reds, yellows, grays);

        svg
          .attr({width: width, height: height})

        svg.select('#graybg')
            .attr('width', width/2)
            .attr('height', height/2);
        svg.select('#greenbg')
            .attr('width', width/2)
            .attr('height', height/2)
            .attr('x', width/2)
            .attr('y', 0);
        svg.select('#yellowbg')
            .attr('width', width/2)
            .attr('height', height/2)
            .attr('x', 0)
            .attr('y', height/2);
        svg.select('#redbg')
            .attr('width', width/2)
            .attr('height', height/2)
            .attr('x', width/2)
            .attr('y', height/2);

        svg.select('#grayNum')
            .attr('x', width*0.25)
            .attr('y', height*0.05)
            .text(`Neutral: ${grays.length}`);
        svg.select('#greenNum')
            .attr('x', width*0.75)
            .attr('y', height*0.05)
            .text(`Good (speed up): ${greens.length}`);
        svg.select('#yellowNum')
            .attr('x', width*0.25)
            .attr('y', height*0.55)
            .text(`OK (don't speed up): ${yellows.length}`);
        svg.select('#redNum')
            .attr('x', width*0.75)
            .attr('y', height*0.55)
            .text(`OMG WTF (slow down): ${reds.length}`);

        var circle = svg.select('g').selectAll('circle')
            .data(students);

        circle.enter().append('circle')
            .attr("r", 0)
          .transition()
            .attr("cy", function(d, i){ return d.coords.y })
            .attr("cx", function(d, i) { return d.coords.x })
            .attr("r", function(d, i) { return d.radius })
            .style('fill', function(d) { return d.color })

        circle
            .attr("r", 0)
          .transition()
            .attr("cy", function(d, i){ return d.coords.y })
            .attr("cx", function(d, i) { return d.coords.x })
            .attr("r", function(d, i) { return d.radius })
            .style('fill', function(d) { return d.color });

        circle.exit()
          .transition()
            .attr('r', 0)
            .remove();

        var defs = svg.select('g').selectAll('clipPath')
            .data(students);
        defs.enter().append('clipPath')
            .attr('id', function(d, i) { return `student${i}`})
          .append('circle')
            .attr("r", 0)
          .transition()
            .attr("cy", function(d, i){ return d.coords.y })
            .attr("cx", function(d, i) { return d.coords.x })
            .attr("r", function(d, i) { return d.radius/2 });

        defs
            .attr('id', function(d, i) { return `student${i}`})
          .append('circle')
            .attr("r", 0)
          .transition()
            .attr("cy", function(d, i){ return d.coords.y })
            .attr("cx", function(d, i) { return d.coords.x })
            .attr("r", function(d, i) { return d.radius/2 });

        defs.exit()
          .transition()
            .attr('r', 0)
            .remove();


        var images = svg.select('g').selectAll('image')
            .data(students);
        images.enter().append('svg:image')
            .attr('width', 0)
            .attr('height', 0)
          .transition()
            .attr("x", function(d, i) { return d.coords.x - d.radius })
            .attr("y", function(d, i){ return d.coords.y - d.radius })
            .attr("width", function(d, i) { return d.radius*2 })
            .attr("height", function(d, i) { return d.radius*2 })
            .attr('xlink:href', function(d, i) { return d.avatar })
            .attr('clip-path', function(d, i) { return `url('#student${i}')` });

        images
            .attr('width', 0)
            .attr('height', 0)
          .transition()
            .attr("x", function(d, i) { return d.coords.x - d.radius })
            .attr("y", function(d, i){ return d.coords.y - d.radius })
            .attr("width", function(d, i) { return d.radius*2 })
            .attr("height", function(d, i) { return d.radius*2 })
            .attr('xlink:href', function(d, i) { return d.avatar })
            .attr('clip-path', function(d, i) { return `url('#student${i}')` });

        images.exit()
          .transition()
            .attr('width', 0)
            .attr('height', 0)
            .remove();

        var names = svg.select('g').selectAll('text')
            .data(students);

        names.enter().append('text')
            .text('')
          .transition()
            .attr("x", function(d, i) { return d.coords.x - d.radius })
            .attr("y", function(d, i) { return d.coords.y + d.radius + 25 })
            .text(function(d, i) { return `${d.name}` });

        names
            .text('')
          .transition()
            .attr("x", function(d, i) { return d.coords.x - d.radius })
            .attr("y", function(d, i) { return d.coords.y + d.radius + 25 })
            .text(function(d, i) { return `${d.name}` });

        names.exit()
          .transition()
            .text('')
            .remove();

      }

      scope.$watch('students', update);
      angular.element($window).bind('resize', function(){
        update();
      });

    }

    return {
      template: '<div class="studentCircles"></div>',
      replace: true,
      restrict: 'EA',
      scope: {
        students: '@',
        percentage: '@',
        circlesbg: '='
      },
      link: link
    }
  })
