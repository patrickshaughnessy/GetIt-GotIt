'use strict';

angular
  .module('app')
  .directive('studentCircle', function($window){

    var link = function(scope, elem, attrs){

      var fillColor = attrs.fill;

      var csize = [100, 100], radius = 22;

      var svg = d3.select(elem[0]).append("svg")
        .attr({width: csize[0], height: csize[1]})
        .attr("viewBox", "0 0 " + csize[0] + " " + csize[1]);

      var circle = svg.selectAll("circle")
          .data([1], function(d) { return d; });

      circle.enter().append("circle")
          .attr("cy", 50)
          .attr("cx", 50)
          .attr("r", 50)
          .attr('fill', fillColor);

      circle.exit().remove();

    }

    return {
      template: '<div class="col-xs-12"></div>',
      replace: true,
      restrict: 'E',
      scope: {
        fill: '@'
      },
      link: link
    }
  })
