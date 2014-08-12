requirejs.config({
  map: {
    'canvas/compiled/behaviors/tooltip': {
      'jqueryui/tooltip': '../../vendor/packages/jqueryui/tooltip'
    }
  }
});

define([ './jqueryui/tooltip', 'canvas/compiled/behaviors/tooltip' ], function($) {
  return $;
});
