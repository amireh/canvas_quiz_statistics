define(function(require) {
  var rawAjax = require('../util/xhr_request');
  var config = require('../config');
  var RSVP = require('rsvp');

  var Adapter = {
    request: function(options) {
      var ajax = config.ajax || rawAjax;

      return RSVP.Promise.cast(ajax(options));
    }
  };

  return Adapter;
});