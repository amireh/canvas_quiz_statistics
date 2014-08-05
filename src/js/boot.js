define(function(require) {
  var React = require('react');
  var initialize = require('./config/initializer');
  var App = require('jsx!./views/app');
  var VERSION = require('./version');
  var layout;

  return {
    version: VERSION,
    mount: function(node) {
      layout = React.renderComponent(App(), node);
    }
  };
});