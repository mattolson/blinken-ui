//console.log('Directives.js!');

'use strict';

demo
	// .directive('timeline', function(){
	// })

	.directive('accData', function(){
		'use strict';
		// //console.log('Binding accelerometer');
		return {
			link: function($scope) {
		 		$(window).bind('acc', function(e) {
					//console.log(e);
			  	$scope.acc = $scope.acc ? $scope.acc : { x : 0, y : 0, z : 0 };
					if(e.accX) $scope.acc.x = (typeof Math.round(e.accX) === "integer")  ? Math.round(e.accX) : $scope.acc.x;
					if(e.accY) $scope.acc.y = (typeof Math.round(e.accY) === "integer")  ? Math.round(e.accY) : $scope.acc.y;
					if(e.accZ) $scope.acc.z = (typeof Math.round(e.accZ) === "integer")  ? Math.round(e.accZ) : $scope.acc.z;
				});
			}
		};
		
	})
	// 
	// .directive('shake', function(){
	// 	'use strict';
	// 	return {
	// 		link: function($scope, Shake, $timeout){
	// 			//console.log('Binding shake.');
	// 			window.addEventListener('shake', shakeevent, false);
	// 
	// 			//function to call when shake occurs
	// 			function shakeevent () {
	// 				$scope.pause = true;
	// 				Shake.update();
	// 				$timeout(function(){
	// 					$scope.pause = false;
	// 				}, 2000)
	// 			}
	// 			
	// 		}
	// 	}
	// 	
	// })
	
	// .directive('speed', function(){
	// 	return {
	// 		
	// 		link : function($scope, $elm){
	// 			$scope.$watch(function(value){
	// 				
	// 			})
	// 		}
	// 	}
	// });
	// 
	
	/**
	 * Inspired by AngularJS' implementation of "click dblclick mousedown..." 
	 *
	 * This ties in the Hammer events to attributes like:
	 * 
	 *   hm-tap="add_something()"
	 *   hm-swipe="remove_something()"
	 *
	 * and also has support for Hammer options with:
	 *
	 *  hm-tap-opts="{hold: false}"
	 *
	 * or any other of the "hm-event" listed underneath.
	 */

	angular.forEach('hmTap:tap hmDoubletap:doubletap hmHold:hold hmTransformstart:transformstart hmTransform:transform hmTransforend:transformend hmDragstart:dragstart hmDrag:drag hmDragend:dragend hmSwipe:swipe hmRelease:release'.split(' '), function(name) {
	  var directive = name.split(':');
	  var directiveName = directive[0];
	  var eventName = directive[1];
	  angular.module('app').directive(directiveName, 
	  ['$parse', function($parse) {
	    return function(scope, element, attr) {
	      var fn = $parse(attr[directiveName]);
	      var opts = $parse(attr[directiveName + 'Opts'])(scope, {});
	      element.hammer(opts).bind(eventName, function(event) {
	        scope.$apply(function() {
	          ////console.log("Doing stuff", event);
	          fn(scope, {$event: event});
	        });
	      });
	    };
	  }]);
	});