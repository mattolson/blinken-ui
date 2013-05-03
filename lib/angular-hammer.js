/**
 * Inspired by AngularJS' implementation of "click dblclick mousedown..." 
 *
 * This ties in the Hammer events to attributes like:
 * 
 *   hm-tap="add_something()"
 *   hm-swipe="remove_something()"
 *
 * and also has support for Hammer options with:
 *
 *  hm-tap-opts="{hold: false}"
 *
 * or any other of the "hm-event" listed underneath.
 */

angular.forEach('hmTap:tap hmDoubletap:doubletap hmHold:hold hmTransformstart:transformstart hmTransform:transform hmTransforend:transformend hmDragstart:dragstart hmDrag:drag hmDragend:dragend hmSwipe:swipe hmRelease:release'.split(' '), function(name) {
  var directive = name.split(':');
  var directiveName = directive[0];
  var eventName = directive[1];
  angular.module('app').directive(directiveName, 
  ['$parse', function($parse) {
    return function(scope, element, attr) {
      var fn = $parse(attr[directiveName]);
      var opts = $parse(attr[directiveName + 'Opts'])(scope, {});
      element.hammer(opts).bind(eventName, function(event) {
        scope.$apply(function() {
          console.log("Doing stuff", event);
          fn(scope, {$event: event});
        });
      });
    };
  }]);
});