'use strict';
var demo = angular.module('app', ['ngResource']);

demo

	.factory('Frame', function ($resource) {
		return $resource( 
			'http://192.168.1.6/Layers/1/', 
			{update: {method:'PUT'} } 
		);
	})
	
	.factory('Shake', function($resource){
		return $resource( 'http://192.163.1.6/Layers/2/', 
		{source: 'sparkle'}, 
		{ update : { method : 'PUT'} } )
	})
	
	.factory('Members', function($resource){
		return $resource( 'http://ideafablabs.com/api/members/total', 
		{ get : { method : 'JSONP'} } )
	});