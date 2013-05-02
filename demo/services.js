'use strict';
var demo = angular.module('app', ['ngResource']);

demo
	.factory('Frame', function ($resource) {
		return $resource( 'http://192.168.1.6/Layers/:id/', {id:'@id'} , {update:{method:'PUT'}})
	})