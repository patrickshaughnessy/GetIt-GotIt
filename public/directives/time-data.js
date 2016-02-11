'use strict';

angular
  .module('app')
  .directive('timeData', function($window, $interval){

    var link = function(scope, elem, attrs){

      var width = $('.studentCirclesArea')[0].clientWidth - $('.studentCirclesArea')[0].clientWidth*0.1;
      var height = $('.studentCirclesArea')[0].clientHeight - $('.studentCirclesArea')[0].clientHeight*0.8;;

      var svg = d3.select(elem[0]).append('svg')
          .attr('width', width)
          .attr('height', height);


      var update = function(){

        width = $('.studentCirclesArea')[0].clientWidth - $('.studentCirclesArea')[0].clientWidth*0.1;
        height = $('.studentCirclesArea')[0].clientHeight - $('.studentCirclesArea')[0].clientHeight*0.8;;

        svg.select('path').remove();
        svg.selectAll('g').remove();
        svg.attr({'width': width, 'height': height})


        var data = angular.fromJson(scope.data).map(function(d, i){
          var coords = {
            x: d.time,
            y: d.percentage
          }
          return coords;
        });

        // use previous data snapshot for transition
        var previousDataSnapshot = data.slice(-((60*5)-1),-1);
        var currentDataSnapshot = data.slice(-(60*5));

        var xMin = d3.min(currentDataSnapshot, function(d){ return d.x; })
        var xMax = d3.max(currentDataSnapshot, function(d){ return d.x; })


        var xScale = d3.time.scale()
            .domain([xMin, xMax])
            .range([width*0.1, width]);

        var xAxisScale = d3.time.scale()
            .domain([xMin, xMax])
            .range([0, width])

        var yScale = d3.scale.linear()
            .domain([0, 100])
            .range([height-20, 10])

        var yAxisScale = d3.scale.linear()
            .domain([0, 100])
            .range([height-20, 10])

        var lineFunction = d3.svg.line()
          .x(function(d) {
            return xScale(d.x);
          })
          .y(function(d) {
            return yScale(d.y);
          })
          .interpolate('basis');

        var xTickSize = xScale(currentDataSnapshot[1].x) - xScale(currentDataSnapshot[0].x);
        var lineGraph = svg.append('path')
          .datum(previousDataSnapshot)
            .attr('d', lineFunction)
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            // .attr('transform', 'translate(' + (xTickSize) + ',0)')
          // .transition()
          //   .duration(500)
          //   .ease('linear')
          //   .attr('transform', 'translate(0,0)')

        var xAxis = d3.svg.axis()
            .scale(xAxisScale)
            .orient('bottom')
            .ticks(5);

        var yAxis = d3.svg.axis()
            .scale(yAxisScale)
            .orient('left')
            .ticks(5)

        svg.append("g")
            .attr('class', 'x axis')
            .call(xAxis)
            .attr("transform", "translate("+ (width*0.1) +", " + (height-20) + ")");
        svg.append("g")
            .attr('class', 'y axis')
            .call(yAxis)
            .attr("transform", "translate("+ (width*0.1)+", " + 0 + ")");

      }

      scope.$watch('data', update);
    }

    return {
      template: '<div class="timeDataArea"></div>',
      replace: true,
      restrict: 'EA',
      scope: {
        data: '@'
      },
      link: link
    }
  })
