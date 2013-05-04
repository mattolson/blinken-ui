'use strict';
// var demo = angular.module('app', ['ngResource']);

var PORT = 8888;

demo

	// 
	// .service('Source', function($resource){
	// 	// Source resource
	// 	      var Source = $resource('http://leds.dev\\:8888/sources/:source_id',
	// 	        { 'source_id': '@id' },
	// 	        { 'update': {method: 'PUT'} }
	// 	      );
	// 		  return Source;
	// 
	// 	      // Layer resource
	// 	      var Layer = $resource('http://leds.dev\\:8888/layers/:layer_id',
	// 	        { 'layer_id': '@id' },
	// 	        { 'update': {method: 'PUT'} }
	// 	      );
	// 				return Layer;
	// 
	// 	      // GET /sources
	// 	      var sources = Source.query(function() {
	// 	        console.log("sources = " + sources);
	// 	      });
	// 				return Sources;
	// 
	// 	      // GET /layers
	// 	      var layers = Layer.query(function() {
	// 	        console.log("layers = " + layers);
	// 	      });
	// 				return layers;
	// })
	// 
	// .service

	.factory('Frame', function ($resource) {
		return $resource( 
			'http://192.168.1.6:port/layers/:id/', 
			{ 
				'id' : 4, 
				'port' : PORT
			},
			{ 
				update: { 
					method:'PUT'
				}
			}
		);
	})
	
	.factory('Layers', function($resource){
		return $resource( 
			'http://192.168.1.6:port/layers/',
			{ 'port' : PORT }
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