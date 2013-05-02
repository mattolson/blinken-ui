'use strict';

blink
	.factory('Effects', function ($resource) {

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
				var url = "http://192.168.1.6:8888/effects";
				$http.jsonp(url);
			}
		}
	
	});