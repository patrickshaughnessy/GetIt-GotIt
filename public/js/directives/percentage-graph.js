'use strict';

angular
  .module('app')
  .directive('percentageGraph', function($window, $interval){

    var link = function(scope, elem, attrs){

      var width = elem[0].clientWidth;
      var height = $('.statsBackground')[0].clientHeight*0.5;

      var margin = {
        left: width*0.1,
        right: width*0.1,
        top: height*0.1,
        bottom: height*0.15
      }

      var svg = d3.select(elem[0]).append('svg')
          .attr('width', width)
          .attr('height', height)

      svg.append('g')
          .attr('transform', `translate(${margin.left}, 0)`)
        // .append('defs').append('clipPath')
        //     .attr('id', 'clip')
        //   .append('rect')
        //     .attr('width',  width - margin.left)
        //     .attr('height', height);
      svg.select('g').append('g')
          .attr('class', 'y axis');
      svg.select('g').append('g')
          .attr('class', 'x axis')
          // .attr('clip-path', 'url(#clip)');
      svg.select('g').append('g')
          // .attr('clip-path', 'url(#clip)')
          .attr('id', 'lineG');



      var update = function(){
        if (!scope.data){
          return;
        }


        width = elem[0].clientWidth;
        height = $('.statsBackground')[0].clientHeight*0.5;

        margin = {
          left: width*0.1,
          right: width*0.1,
          top: height*0.1,
          bottom: height*0.15
        }

        svg.selectAll('path').remove();
        // svg.selectAll('g').remove();

        svg
            .attr('width', width)
            .attr('height', height)
          .select('g')
            .attr('transform', `translate(${margin.left}, 0)`)
          // .select('defs').select('clipPath')
          // .select('rect')
          //   .attr('width',  width - margin.left - margin.right - margin.right*0.05)
          //   .attr('height', height);

        var percentages = angular.fromJson(scope.data).map(function(d, i){
          var coords = {
            x: d.time,
            y: d.percentage
          }
          return coords;
        });

        if (!percentages.length) return;

        var xMin = d3.min(percentages, function(d){ return d.x; })
        var xMax = d3.max(percentages, function(d){ return d.x; })

        var xScale = d3.time.scale()
            .domain([xMin, xMax])
            .range([0,  width - margin.right - margin.left]);

        var yScale = d3.scale.linear()
            .domain([0, 100])
            .range([height - margin.bottom - margin.top, 0])

        var lineFunction = d3.svg.line()
          .x(function(d) {
            return xScale(d.x);
          })
          .y(function(d) {
            return yScale(d.y);
          })
          .interpolate('basis');

        // var xTickSize = xScale(percentages[percentages.length-1].x) - xScale(percentages[percentages.length-2].x);
        var xTickSize = xScale(percentages[1].x) - xScale(percentages[0].x);
        // var xTickSize = d3.extent(percentages, function(d) { return xScale(d.x) });


        // var duration = percentages.length < (60*5) ? 1000 + (xTickSize) : 1000;

        // var duration = 1000;

        svg.select('#lineG')
          .append('path')
            .datum(percentages)
            .attr('transform', `translate(${0}, ${margin.top})`)
            .attr('d', lineFunction)
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('fill', 'none')
          // .transition()
          //   .duration(duration)
          //   .ease('linear')
          //   .attr('transform', `translate(${-xTickSize}, ${margin.top})`);

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .ticks(5);

        svg.select('.x.axis')
          .attr("transform", `translate(${0}, ${height - margin.bottom})`)
          // .transition()
          //   .duration(duration)
          //   .ease('linear')
          .call(xAxis)
            // .attr("transform", `translate(${xTickSize}, ${height - margin.bottom})`)

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .ticks(5)

        svg.select('.y.axis')
            .call(yAxis)
            .attr("transform", `translate(0, ${margin.top})`);

      }

      scope.$watch('data', update);
    }

    return {
      template: '<div class="col-xs-6 percentageGraph"></div>',
      replace: true,
      restrict: 'EA',
      scope: {
        data: '@'
      },
      link: link
    }
  })
