'use strict';
var demo = angular.module('PixelPusher', []);

demo
	.directive('pixelpad', function() {
    'use strict';

    return {
       restrict: 'A',
       scope: {
           value: '=ngModel',
       },
       link:function($scope,elm,$attrs,uiEvent ) {
	
				var $pad = $(elm);
				var key = $attrs.key;			
				$scope.pixels.push = [];
				
			}
   }

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
		
	});

	.directive('shake', function(){
		
		window.addEventListener('shake', shakeEventDidOccur, false);

		//function to call when shake occurs
		function shakeEventDidOccur () {

		    //put your own code here etc.
		    if (confirm("Undo?")) {
						
		    }
		}
		
	});