define(function(require) {
  var RSVP = require('rsvp');
  var d3 = require('./initializers/d3');

  RSVP.on('error', function(e) {
    console.error('RSVP error:', e);

    if (e && e.message) {
      console.error(e.message);
    }
    if (e && e.stack) {
      console.error(e.stack);
    }
  });

  return function initializeApp() {
    return RSVP.resolve();
  };
});