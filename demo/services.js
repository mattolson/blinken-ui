'use strict';
// var demo = angular.module('app', ['ngResource']);

demo

	.factory('Frame', function ($resource) {
		return $resource( 
			'http://192.168.1.6:8888/layers/:id', 
			{ id: 1, '8888' : 8888 },
			{ update: { method:'PUT' } } 
		);
	})
	
	.factory('Shake', function($resource){
		return $resource( 'http://192.163.1.6/layers/2/', 
			{ source: 'sparkle' }, 
			{ update : { method : 'PUT'} } 
		)
	})
	
	.factory('Members', function($resource){
		return $resource( 'http://ideafablabs.com/api/members/total', 
		{ get : { method : 'JSONP'} } )
	});