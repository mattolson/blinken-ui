var BLACK = [0,0,0];
var WHITE = [255,255,255];
	
//It's 12:00am

demo = angular.module('app', ['ngResource']);

function PixelPad($scope, $timeout, $http, Frame, Layers){
	
		$scope.lightness = 200;
		
		//console.log('Controller: PixelPad');
		
		$scope.defaults = [255,255,255];
		
		$scope.pause = false;
		
		$scope.active = false;
		
		$scope.pixels = [ null, null, null ];
		$scope.history = [];
		$scope.history_limit = 13;
		
		$scope.hsv = [];
		$scope.useColor = [];
		$scope.acc = { x : 0, y : 0, z : 0 };
		
		$scope.period = 75;
		
		$scope.activity_level = 0;
		
		//Idle
		$scope.idle = 0;
		$scope.idleThreshold = 30;
		
		$scope.color_phase = {};
		$scope.color_phase.steps = 255;
		$scope.color_phase.step = 0;
		
		// var layers = Layers.get({}, function(response){
		// 		console.log(response);
		// 	});
		
		// POST /layers
		// $scope.layer = new Layer();
		// layer.source = {
		//  name: 'pixel_pulse',
		//  options: {
		//    color: [255,0,0]
		//  }
		// };
		// layer.$save();
		// 
		// console.log(layer);
		// 
		// $scope.layerId = layer.id;

  // PUT /layers/:id
  // var randomizer = setInterval(function() {
  //   // Change to random color every two seconds
  //   layer0.source.options.color = [Math.floor(Math.random()*255.0), Math.floor(Math.random()*255.0), Math.floor(Math.random()*255.0)]; 
  //   layer0.$update();
  // }, 2000);
  // 
  // // DELETE /layers/:id
  // setTimeout(function() {
  //   clearInterval(randomizer);
  //   layer0.$remove();
  // }, 10000);
		
		
		
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
				if($scope.pixels[p] !== null) return true;
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
			
			$scope.activity_level++;
			// var state = $scope.pixels[key] !== null;
			////console.log('toggle pixel '+key+'. Present state: '+state);
			// console.log('hsv '+$scope.motionToHSV() );	
			//If on, turn off ; if off, turn on.
			$scope.pixels[key] = (state) ? null : $scope.hsv;
			
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
		
		$scope.cap_integer = function(value, max) { return (value < max) ? value : max; }
		
		//Normalizes accelerometer values between 0 & 255
		$scope.normalize = function(x){
			
			var res = Math.round( 1 + (x-(-180)) * (255-0) / ((180)-(-180)) );
			// var res = x*20;
			// console.log( res );
			return res;
		
		};
		
		$scope.scalePeriod = function(){
			var scale = $scope.activity_level+1;
			$scope.period = Math.floor(1000/scale);
		}
		
		//Take acceleratomenter data and transform into HSV
		$scope.motionToHSV = function(){
			
			if($scope.acc) {
				var h = $scope.normalize(Math.round($scope.acc.x));
				var s = $scope.normalize(Math.round($scope.acc.y));
				var l = $scope.lightness;
				
				console.log('H:'+h+' S:'+s+' L:' + l);
				
				console.log('X:'+$scope.acc.x+' Y:'+$scope.acc.y);
				
				return [h,s,l];
			} else {
				return [255,255,255];
			}
			
		};
		
		$scope.rules = function(){
			$scope.activeRule = false;
			switch(true) {
				case ($scope.acc.y > 160 || $scope.acc.y < -160) :
					$scope.activeRule = 'inverse';
					return true;
				break
				default :
					return false;
			}
		};
		
		$scope.applyRequest = function(){
			switch($scope.activeRule){
				case 'inverse':
						$scope.useColor = ['0','0','0'];
						$scope.request = {
							name : 'Frames',
							source : {
								name : 'pixel_pulse',
								options : {
									background: $scope.hsv,
									colors: $scope.pixels,
									period : $scope.period
								}
							}
						};
				break;
				default:
					$scope.request = {
						name : 'Frames',
						source : {
							name : 'pixel_pulse',
							options : {
								colors: $scope.pixels,
								period : $scope.period
							}
						}
					};
			}
		}
		
		var update = function() {
			
		$scope.addFrame = function(){
			
			$scope.response = $http.put(
				'http://192.168.1.6:8888/layers/4/',
				$scope.request, 
				function(obj){
					console.log(obj.id);
			});
			
			$scope.$watch('response', function(status, response){
				console.log(status+response);
			});
			
		}
		
		$scope.applyColor = function(){
			$scope.useColor = ($scope.useColor) ? $scope.useColor : $scope.hsv;
		}
	  
		cancelRefresh = $timeout(function update() {
			//If running a cheat/hack (lioke the shake=sparkle hack) you can pause the timeline here.
			if($scope.pause) return true;			
			
			$scope.rules();
			
			$scope.applyColor();
			
			$scope.scalePeriod();
			
			$scope.session();


			if($scope.isPixels()) $scope.addFrame();
			else $scope.activity_level = ($scope.activity_level > 0) ? $scope.activity_level-1 : 0;
			
			//Cache the data (history)
			$scope.cache();
			
			//Reset the frame;
			$scope.purge();
			
			//Infinite loop
      cancelRefresh = $timeout(update, $scope.period);

			$scope.hsv = $scope.motionToHSV();
			
			$scope.useColor = false;
			
			console.log($scope.activity_level);
			
			console.log($scope.activeRule);

			//This beats interval, I'll explain why sometime.
    	}, $scope.period);
		};
		
		update();
		
};
	
//It's 12:24 am.


/*
 *
 * Find more about this plugin by visiting
 * http://alxgbsn.co.uk/
 *
 * Copyright (c) 2010-2012 Alex Gibson
 * Released under MIT license
 *
 */

(function (window, document) {

	function Shake() {

		//feature detect
		this.hasDeviceMotion = 'ondevicemotion' in window;

		//default velocity threshold for shake to register
		this.threshold = 15;

		//use date to prevent multiple shakes firing	
		this.lastTime = new Date();

		//accelerometer values
		this.lastX = null;
		this.lastY = null;
		this.lastZ = null;

		//create custom event
		this.event = document.createEvent('Event');
		this.event.initEvent('shake', true, true);
	}

	//reset timer values
	Shake.prototype.reset = function () {

		this.lastTime = new Date();
		this.lastX = null;
		this.lastY = null;
		this.lastZ = null;
	};

	//start listening for devicemotion
	Shake.prototype.start = function () {

		this.reset();
		if (this.hasDeviceMotion) { window.addEventListener('devicemotion', this, false); }
	};

	//stop listening for devicemotion
	Shake.prototype.stop = function () {

		if (this.hasDeviceMotion) { window.removeEventListener('devicemotion', this, false); }
		this.reset();
	};

	//calculates if shake did occur
	Shake.prototype.devicemotion = function (e) {

		var current = e.accelerationIncludingGravity,
			currentTime,
			timeDifference,
			deltaX = 0,
			deltaY = 0,
			deltaZ = 0;

		if ((this.lastX === null) && (this.lastY === null) && (this.lastZ === null)) {

			this.lastX = current.x;
			this.lastY = current.y;
			this.lastZ = current.z;
			return;
		}

		deltaX = Math.abs(this.lastX - current.x);
		deltaY = Math.abs(this.lastY - current.y);
		deltaZ = Math.abs(this.lastZ - current.z);

		if (((deltaX > this.threshold) && (deltaY > this.threshold)) || ((deltaX > this.threshold) && (deltaZ > this.threshold)) || ((deltaY > this.threshold) && (deltaZ > this.threshold))) {

			//calculate time in milliseconds since last shake registered
			currentTime = new Date();
			timeDifference = currentTime.getTime() - this.lastTime.getTime();

			if (timeDifference > 1000) {
				window.dispatchEvent(this.event);
				this.lastTime = new Date();
			}
		}
		
		this.lastX = current.x;
		this.lastY = current.y;
		this.lastZ = current.z;

	};

	//event handler
	Shake.prototype.handleEvent = function (e) {

		if (typeof (this[e.type]) === 'function') {
			return this[e.type](e);
		}
	};

	//create a new instance of shake.js.
	var myShakeEvent = new Shake();
	myShakeEvent.start();

}(window, document));