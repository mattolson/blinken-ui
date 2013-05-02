'use strict';

blink
	.directive('pixelpad', function() {
		
    'use strict';

    return {
       restrict: 'A',
       scope: {
           value: '=ngModel',
       },
       link:function($scope,elm,$attrs,uiEvent ) {
				
				var $this = $(elm);

        var expression,
        options = {
          range: true,
          values: scope.values,
          slide: function(event,ui){
            scope.$apply(function(){
					 		scope.option.current = ui.value;
          	})
					}
        };
       
			 if ($attrs.uiSlider) {
         expression = scope.$eval($attrs.uiSlider);
       } else {
         expression = {};
       }

        //Set the options from the directive's configuration
       angular.extend(options, uiConfig.devCalendar, expression);
       // console.log(options);
       elm.slider(options);
       }

   };