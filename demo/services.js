'use strict';
// var demo = angular.module('app', ['ngResource']);

var PORT = 8888;

demo

	.factory('Frame', function ($resource) {
		return $resource( 
			'http://192.168.1.6:port/layers/:id/', 
			{ 
				'id' : 4, 
				'port' : PORT,
				'source' : '@source'
			},
			{ 
				update: { 
					method:'PUT',
					// headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}  
				}
			}
		);
	})
	
	.factory('Layers', function($resource){
		return $resource( 
			'http://192.168.1.6:port/layers/',
			{'port' : PORT }
		);
	})
	
	.factory('Shake', function($resource){
		return $resource( 'http://192.163.1.6:port/layers/2/', 
			{ source: 'sparkle', 'port' : PORT }, 
			{ update : { method : 'PUT'} } 
		)
	});
	
	// .factory('Members', function($resource){
	// 	return $resource( 'http://ideafablabs.com/api/members/total', 
	// 	{ get : { method : 'JSONP'} } )
	// });