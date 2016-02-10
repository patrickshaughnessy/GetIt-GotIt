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
        svg.attr({'width': width, 'height': height})

        var data = angular.fromJson(scope.data).map(function(d, i){
          var coords = {
            x: d.time,
            y: d.percentage
          }
          return coords;
        })

        console.log(data);
        var getX = d3.scale.linear().domain([data[0].x, data[data.length-1].x]).range([width*0.1, width]);

        var lineFunction = d3.svg.line()
          .x(function(d) {
            return Math.round(getX(d.x))
          })
          .y(function(d) {
            return 100 - d.y;
          })
          .interpolate('basis');

        var lineGraph = svg.append('path')
            .attr('d', lineFunction(data))
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('fill', 'none')

      }

      scope.$watch('data', update);




      // if (!scope.data.length){
      //   return;
      // }
      //
      // var width = 500;
      // var height = 100;
      //
      // // create an SVG element inside the #graph div that fills 100% of the div
  		// var graph = d3.select(elem[0]).append("svg:svg").attr("width", "100%").attr("height", "100%");
      //
  		// // create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
  		// // var data = [3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 9];
      // var data = angular.fromJson(scope.data).map(function(d){
      //   return d;
      // })
      //
      // var xDomain = data.map(function(d){
      //   return d.time;
      // })
      // console.log(xDomain);
      // var xMin = d3.min(xDomain);
      // var xMax = d3.max(xDomain);
      //
      // console.log('xmin', xMin, 'xMax', xMax);
      //
      //
      //
  		// 	// display the line by appending an svg:path element with the data line we created above
  		// 	// graph.append("svg:path").attr("d", line(data));
  		// 	// or it can be done like this
  		// 	//graph.selectAll("path").data([data]).enter().append("svg:path").attr("d", line);
      //
      //
  		// 	function update() {
  		// 		// update with animation
      //     // var v = data.shift(); // remove the first element of the array
			//     // data.push(v); // add a new element to the array (we're just taking the number we just shifted off the front and appending to the end)
      //     data = angular.fromJson(scope.data).map(function(d){
      //       return d;
      //     });
      //
      //     data.shift();
      //
      //     var xDomain = data.map(function(d){
      //       return d.time;
      //     })
      //     console.log(xDomain);
      //     xMin = d3.min(xDomain);
      //     xMax = d3.max(xDomain);
      //
      //     console.log('xmin', xMin, 'xMax', xMax);
      //
      //     // X scale will fit values from 0-10 within pixels 0-100
      // 		var x = d3.scale.linear().domain([xMin, xMax]).range([0, width]); // starting point is -5 so the first value doesn't show and slides off the edge as part of the transition
      // 		// Y scale will fit values from 0-10 within pixels 0-100
      // 		var y = d3.scale.linear().domain([0, 100]).range([0, height]);
      //
      // 		// create a line object that represents the SVN line we're creating
      // 		var line = d3.svg.line()
      // 			// assign the X function to plot our line as we wish
      // 			.x(function(d,i) {
      // 				// verbose logging to show what's actually being done
      // 				// console.log('x', x(d.time));
      // 				// return the X coordinate where we want to plot this datapoint
      // 				return x(d.time);
      // 			})
      // 			.y(function(d) {
      // 				// verbose logging to show what's actually being done
      // 				// console.log('y', d.percentage);
      // 				// return the Y coordinate where we want to plot this datapoint
      // 				return y(d.percentage);
      // 			})
      // 			.interpolate('basis')
      //
      //     graph.selectAll('path').remove();
      //
      //     graph.append("svg:path").attr("d", line(data));
      //
      //
      //     console.log('x1', x(1), 'x0', x(0));
  		// 		graph.selectAll("path")
  		// 			.data([data]) // set the new data
  		// 			.attr("transform", "translate(" + x(1) + ")") // set the transform to the right by x(1) pixels (6 for the scale we've set) to hide the new value
  		// 			.attr("d", line) // apply the new data values ... but the new value is hidden at this point off the right of the canvas
  		// 			.transition() // start a transition to bring the new value into view
  		// 			.ease("linear")
  		// 			.duration(100) // for this demo we want a continual slide so set this to the same as the setInterval amount below
  		// 			.attr("transform", "translate(" + x(0) + ")"); // animate a slide to the left back to x(0) pixels to reveal the new value
      //
  		// 			/* thanks to 'barrym' for examples of transform: https://gist.github.com/1137131 */
  		// 	}
      //
  		// 	function redrawWithoutAnimation() {
  		// 		// static update without animation
  		// 		graph.selectAll("path")
  		// 			.data([data]) // set the new data
  		// 			.attr("d", line); // apply the new data values
  		// 	}

  			// setInterval(function() {
  			//    var v = data.shift(); // remove the first element of the array
  			//    data.push(v); // add a new element to the array (we're just taking the number we just shifted off the front and appending to the end)
  			//    if(animate) {
  			// 	   redrawWithAnimation();
  			//    } else {
  			//    	   redrawWithoutAnimation();
  			//    }
  			// }, updateDelay);







      //
      // // create the initial svg element
      // var width = $('.timeDataArea')[0].clientWidth;
      // var height = 100;
      // var interpolation = 'basis';
      // var animate = true;
      // var updateDelay = 1000;
      // var transitionDelay = 1000;
      //
      // var svg = d3.select(elem[0])
      //   .append("svg")
      //     .attr("width", "100%").attr("height", "100%")
      //
      // var update = function() {
      //
      //   width = $('.timeDataArea')[0].clientWidth;
      //   height = 100;
      //
    	// 	var data = angular.fromJson(scope.data).slice(1);
      //
      //   // data.shift(); // remove the first element of the array for movement
      //   var xmin = data.length ? data[0].time : 0;
      //   var xmax = data.length ? data[data.length-1].time : 0;
      //
      //   console.log('xmin', xmin, 'xmax', xmax)
    	// 	// X scale will fit values from start time to end time in width range
    	// 	var x = d3.scale.linear().domain([xmin, xmax]).range([0, width]); // starting point is -5 so the first value doesn't show and slides off the edge as part of the transition
    	// 	// Y scale will fit values from 0 - 100 in the height range
    	// 	var y = d3.scale.linear().domain([0, 100]).range([0, height]);
      //
      //   console.log('x1', Math.round(x(1)),'x0', Math.round(x(0)));
      //
    	// 	var line = d3.svg.line()
    	// 		.x(function(d, i) { return x(d.time); })
    	// 		.y(function(d, i) { return y(d.percentage); })
    	// 		.interpolate(interpolation)
      //
      //   // var graph = svg.selectAll('path')
      //   //   .data([data]);
  		// 	// var graph = svg.append("svg:path").attr("d", line(data));
      //   svg.append("svg:path").attr("d", line(data));
  		// 	// var graph = svg.selectAll("path").data([data]).enter().append("svg:path").attr("d", line(data));
      //
      //   svg.selectAll("path")
			// 		.data([data]) // set the new data
      //     .attr("transform", "translate(" + xmin + ")") // set the transform to the right by x(1) pixels (6 for the scale we've set) to hide the new value
      //     .attr("d", line(data)) // apply the new data values ... but the new value is hidden at this point off the right of the canvas
      //     .transition() // start a transition to bring the new value into view
      //     .ease("linear")
      //     .duration(transitionDelay) // for this demo we want a continual slide so set this to the same as the setInterval amount below
      //     .attr("transform", "translate(" + xmax + ")"); // animate a slide to the left back to x(0) pixels to reveal the new value
      //
      //     /* thanks to 'barrym' for examples of transform: https://gist.github.com/1137131 */
      // }

      // scope.$watch('data', update);
      // angular.element($window).bind('resize', function(){
      //   svg.attr('width', $('.studentCirclesArea')[0].clientWidth);
      //   svg.attr('height', $('.studentCirclesArea')[0].clientHeight);
      //   update();
      // });

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
