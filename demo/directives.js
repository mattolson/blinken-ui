'use strict';
var demo = angular.module('app', []);

demo
	.directive('timeline', function(){
		return {
			link: function($scope, $el) {
				$scope.$watch('history', function(){
					$scope.timelineWidth += 102;
				});
				
				$($el).css('width' , $(document).width)
			}
		}
	})

	.directive('acc', function(){
		
		return {
			link: function($scope) {
		 		$(window).bind('acc', function(e) {
			  	$scope.acc = {};
					$scope.acc.x = e.accX;
					$scope.acc.y = e.accY;
					$scope.acc.z = e.accZ ? e.accZ : null;
				});
			}
		};
		
	})

	.directive('shake', function(){
		
		window.addEventListener('shake', shakeEventDidOccur, false);

		//function to call when shake occurs
		function shakeEventDidOccur () {

		    //put your own code here etc.
		    if (confirm("Undo?")) {
						
		    }
		}
		
	});