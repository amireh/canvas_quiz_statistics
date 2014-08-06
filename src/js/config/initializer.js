define(function(require) {
  var RSVP = require('rsvp');
  var d3 = require('./initializers/d3');

  return function initializeApp() {
    return RSVP.resolve();
  };
});