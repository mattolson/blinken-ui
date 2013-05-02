'use strict';

blink
	.factory('AddFrame', function ($resource) {
		return $resource( 'http://192.168.1.6/:id/', {id:'@id'} ,  )
	})