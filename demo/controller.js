var BLACK = [0,0,0];
var WHITE = [255,255,255];
	
//It's 12:00am

demo = angular.module('app', ['ngResource']);

function PixelPad($scope, $timeout, Frame, Layers){
	
		$scope.lightness = 200;
		
		////console.log('Controller: PixelPad');
		
		$scope.defaults = [255,255,255];
		
		$scope.pause = false;
		
		$scope.active = false;
		
		$scope.pixels = [ null, null, null ];
		$scope.history = [];
		$scope.history_limit = 13;
		
		// $scope.hsv = [];
		$scope.acc = {};
		
		$scope.period = 250;
		
		//Idle
		$scope.idle = 0;
		$scope.idleThreshold = 30;
		
		$scope.color_phase = {};
		$scope.color_phase.steps = 255;
		$scope.color_phase.step = 0;
		
		// var layers = Layers.get({}, function(response){
		// 		console.log(response);
		// 	});
		
		
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
			
			$scope.history.unshift(frame);
			
			if($scope.history.length > $scope.history_limit) $scope.history.pop();
		};
		
		$scope.purge = function(){
			$scope.pixels = [ null, null, null ];
		}
		
		//If the number of idle frames is less than the idea_threshold than someone is using the controller.
		$scope.resetSession = function(){
			if($scope.idle < $scope.idleThreshold) {
				$scope.active=true;
			} else {
				
			}
		};
		
		//method to turn activate and deactive an active pixel.
		$scope.togglePixel = function(key){
			var state = false;
			// var state = $scope.pixels[key] !== null;
			////console.log('toggle pixel '+key+'. Present state: '+state);
		
			console.log('hsv '+$scope.motionToHSV() );	
			//If on, turn off ; if off, turn on.
			$scope.pixels[key] = (state) ? null :  $scope.motionToHSV() ;
			
			$scope.save();
			
			//console.log('RGB' + $scope.hsvToRGB( $scope.motionToHSV() ) );
			// $scope.pixels[key] = (state) ? null : [255,255,255];
			
			////console.log($scope.history)
		
		};
		
		$scope.colorPhasing - function(step){
			var newhue = $scope.colorPhase.hue + (1 * step);
			if(newhue > $scope.color_phase.steps) newhue = 0;
			$scope.colorPhase.hue = newhue;
			$scope.color_phase.step++;
			return (newhue) ? step : 0;
		}
		
		$scope.cap_integer = function(value, max) {
			return (value < max) ? value : max;
		}
		
		//Normalizes accelerometer values between 0 & 255
		$scope.normalize = function(x){
			var res = Math.round( 1 + (x-(-50)) * (255-0) / ((100)-(-50)) );
			// var res = x*20;
			// console.log( res );
			return res;
		};
		
		//Take acceleratomenter data and transform into HSV
		$scope.motionToHSV = function(){
			// console.log('h'+$scope.normalize(Math.round($scope.acc.x)))
			// console.log('s'+$scope.normalize(Math.round($scope.acc.y)))

			if($scope.acc) {
				var h = $scope.normalize(Math.round($scope.acc.x));
				var s = $scope.normalize(Math.round($scope.acc.y));
				var l = $scope.lightness;
				
				return [h,s,l];
			} else {
				return [255,255,255];
			}
		};
		
		// $scope.hsvToRGB = function(hsv) {
		// 	  var h = hsv.hue, s = hsv.sat, v = hsv.val;
		// 	  var rgb, i, data = [];
		// 	  if (s === 0) {
		// 	    rgb = [v,v,v];
		// 	  } else {
		// 	    h = h / 60;
		// 	    i = Math.floor(h);
		// 	    data = [v*(1-s), v*(1-s*(h-i)), v*(1-s*(1-(h-i)))];
		// 	    switch(i) {
		// 	      case 0: return [v, data[2], data[0]];
		// 	      case 1: return [data[1], v, data[0]];
		// 	      case 2: return [data[0], v, data[2]];
		// 	      case 3: return [data[0], data[1], v];
		// 	      case 4: return [data[2], data[0], v];
		// 	      default: return [v, data[0], data[1]];
		// 	    }
		// 	  }
		// 	  // return '#' + rgb.map(function(x){ 
		// 	  // 		    return ("0" + Math.round(x*255).toString(16)).slice(-2);
		// 	  // 		  }).join('');
		// 	};
		// 	
		//This updates the server every so often.
		var update = function() {
			
		$scope.save = function(){
			var frame = Frame.update({
				'source' : {
					'name' : 'pixel_pulse',
					'options' : {
						'colors': $scope.pixels,
						'period' : $scope.period
					}
				}
			}, function(response, erp){
					console.log('Node informed, it says '+response + ' AND '+erp);
					////console.log('Node informed.');
			});
			
			console.log(frame);
		}
	   
		cancelRefresh = $timeout(function update() {
			//If running a cheat/hack (lioke the shake=sparkle hack) you can pause the timeline here.
			if($scope.pause) return true;			
			////console.log('refreshing');
			
			//console.log('total frames in history: '+$scope.history.length)
			
			////console.log('Total pixels per frame: '+$scope.pixels.length);
			//Activity based "sessions."
			$scope.session();
			
			// var frame = new Frame();
			// 		frame.source = {
			// 			name : 'pixel_pulse',
			// 			options : {
			// 				'colors': $scope.pixels,
			// 				'period' : $scope.period
			// 			}
			// 		};
			// 		frame.$update();
			
			//
			// console.log(frame);
			
			//Cache the data (history)
			$scope.cache();
			
			//Reset the frame;
			$scope.purge();
			
			//Infinite loop
       cancelRefresh = $timeout(update, $scope.period);

			//This beats interval, I'll explain why sometime.
    	}, $scope.period);
		};
		
		update();
		
};
	
//It's 12:24 am.