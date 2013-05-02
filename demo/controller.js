var BLACK = [0,0,0];
var WHITE = [255,255,255];
	
//It's 12:00am
'use strict';
var demo = angular.module('app', []);

function PixelPad($scope, $timeout, Frame){
		
		console.log('Controller: PixelPad');
		
		$scope.defaults = [255,255,255];
		
		$scope.active = false;
		
		$scope.pixels = [ null, null, null ];
		$scope.history = [];
		
		// $scope.hsv = [];
		$scope.acc = [];
		
		$scope.timeout = 100;
		
		//Idle
		$scope.idle = 0;
		$scope.idleThreshold = 30;
		
		var updateCallback = function(){
			console.log('Node informed.');
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
			var p;
			for(p=0;p<3;p++) {
				if(typeof $scope.pixels[p] === 'array') return true;
			}
		}
		
		$scope.cache = function(){
			var frame = {};
					frame.color = $scope.pixels;
					// frame.virgin = $scope.isPixels();
			
			$scope.history.unshift(frame);
			
			if($scope.history.length >= 100) $scope.history.pop();
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
			var state = ( typeof $scope.pixels[key] === 'array' );
			console.log('toggle pixel '+key+'. Present state: '+state);
		
			// console.log('hsv '+$scope.hsvToRGB( $scope.motionToHSV() ));	
			//If on, turn off ; if off, turn on.
			// $scope.pixels[key] = (state) ? null : $scope.hsvToRGB( $scope.motionToHSV() );
			$scope.pixels[key] = (state) ? null : [255,255,255];
			
			console.log($scope.history)
		
		};
		
		//Normalizes accelerometer values between 0 & 255
		$scope.normalize = function(x){
			return Math.round( 1 + (x-(-2.5)) * (255-1) / ((2.5)-(-2.5)) );
		};
		
		//Take acceleratomenter data and transform into HSV
		$scope.motionToHSV = function(){
			if($scope.acc.length) {
				var a = $scope.normalize($scope.acc.x);
				var b = $scope.normalize($scope.acc.y);
				var c = $scope.normalize($scope.acc.z);
				return [a,b,c]
			} else {
				return [255,255,255]
			}
		};
		
		$scope.hsvToRGB = function(hsv) {
		  var h = hsv.hue, s = hsv.sat, v = hsv.val;
		  var rgb, i, data = [];
		  if (s === 0) {
		    rgb = [v,v,v];
		  } else {
		    h = h / 60;
		    i = Math.floor(h);
		    data = [v*(1-s), v*(1-s*(h-i)), v*(1-s*(1-(h-i)))];
		    switch(i) {
		      case 0:
		        return [v, data[2], data[0]];
		        break;
		      case 1:
		        return [data[1], v, data[0]];
		        break;
		      case 2:
		        return [data[0], v, data[2]];
		        break;
		      case 3:
		        return [data[0], data[1], v];
		        break;
		      case 4:
		        return [data[2], data[0], v];
		        break;
		      default:
		        return [v, data[0], data[1]];
		        break;
		    }
		  }
		  // return '#' + rgb.map(function(x){ 
		  // 		    return ("0" + Math.round(x*255).toString(16)).slice(-2);
		  // 		  }).join('');
		};
		
		//This updates the server every so often.
		var update = function() {
	   cancelRefresh = $timeout(function update() {
			console.log('refreshing');
			console.log('Total pixels per frame: '+$scope.pixels.length);
			//Activity based "sessions."
			$scope.session();
			//send the frame data
			// var frame = Frame.save({data:$scope.pixels}, updateCallback);
			//Cache the data (history)
			$scope.cache();
			//Reset the frame;
			$scope.purge();
			//Infinite loop
       cancelRefresh = $timeout(update, $scope.timeout);
    	}, $scope.timeout);
		};
		
		update();
		
};
	
//It's 12:24 am.