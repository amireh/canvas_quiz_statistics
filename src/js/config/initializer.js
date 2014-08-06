define(function(require) {
  var RSVP = require('rsvp');
  var d3 = require('./initializers/d3');

  //>>excludeStart("production", pragmas.production);
  var DEBUG = require('./initializers/debug');
  //>>excludeEnd("production");

  return function initializeApp() {
    return RSVP.resolve();
  };
});