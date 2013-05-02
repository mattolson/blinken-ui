'use strict';
var demo = angular.module('PixelPusher', []);

demo
	.factory('AddFrame', function ($resource) {
		return $resource( 'http://192.168.1.6/:id/', {id:'@id'} ,  )
	})