'use strict';

blink

	.factory('socket', function ($rootScope) {
    var socket = io.connect('leds.dev:8888');
    return {
      on: function (eventName, callback) {
						socket.on(eventName, function () {  
          		var args = arguments;
          		$rootScope.$apply(function () {
            		callback.apply(socket, args);
          		});
						});
      		},
      emit: function (eventName, data, callback) {
							socket.emit(eventName, data, function () {
          			var args = arguments;
          			$rootScope.$apply(function () {
            		if (callback) {
              		callback.apply(socket, args);
            		}
          		});
						})
     			}
  	};
  })

	.factory('Grid', function($rootScope, socket){
		
		return {
			
			'turnOff' : function() {
		    socket.emit("off", {});
		  },

			'registerEffect' : function(effect) {
				socket.emit("off", {});
		    socket.emit("effect:register", effect);
		  },

		  // submit a changed led via socket
		  'submitLed' : function(led) {
		    socket.emit("change:led", {
		      x: led.x, 
		      y: led.y, 
		      rgb: led.rgb
		    });
		  }
		}
		
	})

	//These would be made more robust, would return an object with some useful getters/setters
	.factory('Leds', function ($resource) {
		var data = null;
		var Leds = $resource('http://leds.dev:8888/leds', {8888: ':8888'} , { get: {method: 'JSONP'} });
				return Leds;
	})
	
	.factory('Effects', function ($resource) {
		// var Effects = $resource('http://leds.dev:8888/effects', {8888: ':8888'} , { get: {method: 'JSONP'} });
		// 		return Effects;
		return {
			list : function($scope){
				var ListEffectsJson = function(data) {
				    $scope.assets = data;
						for(var i=0;i<$scope.assets.length;i++){
							for(var k=0;k<$scope.assets[i].options.length;k++){
								$scope.assets[i].options[k].current = $scope.assets[i].options[k].default;
							}
						}
				}
				var url = "http://leds.dev:8888/effects";
				$http.jsonp(url);
			}
		}
		
	});
	
	
	// // TEMPORARY (until we have an interface for setting options)
	
	//   if (effect == 'throb') {
	//     options['period'] = 40;
	//     options['start_color'] = [0,0,0];
	//     options['end_color'] = [255,255,255];
	//   }
	//   else if (effect == 'color_wipe') {
	//     options['period'] = 40;
	//     options['color'] = [255,0,0];
	//   }
