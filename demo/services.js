'use strict';
// var demo = angular.module('app', ['ngResource']);

demo

	.factory('Frame', function ($resource) {
		return $resource( 
			'http://192.168.1.6:8888/layers/:id', 
			{ id: 4, 'port' : 8888 },
			{ update: { method:'PUT' } } 
		);
	})
	
	.factory('Layers', function($resource){
		return $resource( 
			'http://192.168.1.6:8888/layers/',
			{'port' : 8888 }
		);
	})
	
	.factory('Shake', function($resource){
		return $resource( 'http://192.163.1.6:port/layers/2/', 
			{ source: 'sparkle', 'port' : 8888 }, 
			{ update : { method : 'PUT'} } 
		)
	});
	
	// .factory('Members', function($resource){
	// 	return $resource( 'http://ideafablabs.com/api/members/total', 
	// 	{ get : { method : 'JSONP'} } )
	// });