//It's 12:00am

blink
	.controller('PixelPad', function($timeout, AddFrame){
		
		$scope.active = false;
		
		$scope.pixels = [ null, null, null ];
		$scope.history = [];
		
		// $scope.hsv = [];
		$scope.xyz = [];
		
		$scope.timeout = 500;
		
		//Idle
		$scope.idle = 0;
		$scope.idleThreshold = 30;
		
		//This updates the server every so often.
		var update = function() {
		    cancelRefresh = $timeout(function update() {
						//Activity based sessions.
						$scope.session();
						//Query accelerometer & generate HSCV
						// $scope.interpretMotion();
						//send the frame data
						AddFrame.save($scope.pixels);
						//Calculate some meta.
						$scope.meta();
						//Cache the data (history)
						$scope.cache();
						//Reset the frame;
						$scoope.purge();
						//Infinite loop
		        cancelRefresh = $timeout(update, $scope.timeout);
		    }, $scope.timeout);
		};
		
		//Cancels timeout in case views disrupts us, fail safe
		$scope.$on('$destroy', function(e) {
		    $timeout.cancel(update);
		});
		
		$scope.session = function(){
			var isPixels = $scope.isPixels();
			if(!isPixels) $scope.idle++; //Increase the idle count
			if($scope.active == false && isPixels) $scope.active = true; //Nobody has been using it, but surprise, there's pixel data... active is now true.
		}
		
		$scope.isPixels = function(){
			for(var p=0;p<3;p++) {
				if(typeof $scope.pixels[p] == 'array') return true;
			}
		}
		
		$scope.cache = function(){
			var cache = {};
					cache.color = $scope.pixels;
					cache.virgin = $scope.isPixels();
			
			$scope.history.unshift(cache);
		};
		
		$scope.purge = function(){
			$scope.pixels = [ null, null, null ];
		}
		
		//If the number of idle frames is less than the idea_threshold than someone is using the controller.
		$scope.resetSession = function(){
			if($scope.idle < $scope.idleThreshold) return ($scope.active=true);
			return ($scope.active=true)
		};
		
		//method to turn activate and deactive an active pixel.
		$scope.togglePixel = function(key){
			var state = ($scope.pixels[key] && $scope.isPixels);
				$scope.pixels[key] = (state) ? $scope.motionToHSV() : null;
			}
		};
		
		//Normalizes accelerometer values between 0 & 255
		$scope.normalize = function(x){
			return Math.round( 1 + (x-(-2.5)) * (255-1) / ((2.5)-(-2.5)) )
		};
		
		//Take acceleratomenter data and transform into HSV
		$scope.motionToHSV = function(){
			var a = $scope.normalize($scope.acc.x);
			var b = $scope.normalize($scope.acc.y);
			var c = $scope.normalize($scope.acc.z);
			return [a,b,c]
		};
		
	})
	
//It's 12:24 am.