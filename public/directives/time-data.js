'use strict';

angular
  .module('app')
  .directive('timeData', function($window, $interval){

    var link = function(scope, elem, attrs){

      var width = $('.timeDataArea')[0].clientWidth - $('.timeDataArea')[0].clientWidth*0.2;
      var height = 120;

      var svg = d3.select(elem[0]).append('svg')
          .attr('width', width)
          .attr('height', height);


      var update = function(){

        width = $('.timeDataArea')[0].clientWidth - $('.timeDataArea')[0].clientWidth*0.2;
        height = 120;

        svg.select('path').remove();
        svg.select('g').remove();
        svg.attr({'width': width, 'height': height})



        var data = angular.fromJson(scope.data).map(function(d, i){
          // var format = d3.time.format('%c');
          // var date = new Date(d.time);
          // console.log(format(date));
          var coords = {
            x: d.time,
            y: d.percentage
          }
          return coords;
        })

        var xdata = data.map(function(d){
          return d.x;
        })

        var xMin = d3.min(data, function(d){ return d.x; })
        var xMax = d3.max(data, function(d){ return d.x; })

        var xScale = d3.time.scale()
            .domain([xMin, xMax])
            .range([width*0.1, width]);

        var xAxisScale = d3.time.scale()
            .domain([xMin, xMax])
            .range([0, width])

        var yScale = d3.scale.linear()
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

        var lineGraph = svg.append('path')
            .attr('d', lineFunction(data))
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('fill', 'none')

        var xAxis = d3.svg.axis()
            .scale(xAxisScale)
            .orient('bottom');
            // .tickFormat(d3.time.format('%H-%M'))

        svg.append("g")
            .call(xAxis)
            .attr("transform", "translate(0, " + (height-20) + ")")

      }

      scope.$watch('data', update);
    }

    return {
      template: '<div class="col-xs-12"></div>',
      replace: true,
      restrict: 'EA',
      scope: {
        data: '@'
      },
      link: link
    }
  })
