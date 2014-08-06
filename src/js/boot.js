define(function(require) {
  var React = require('react');
  var initialize = require('./config/initializer');
  var Layout = require('jsx!./views/app');
  var VERSION = require('./version');
  var deserialize = require('./core/deserializer');
  var container;
  var layout;
  var singleton;

  var CQS = function() {
    return this;
  };

  CQS.prototype = {
    version: VERSION,

    mount: function(node) {
      container = node;
      layout = React.renderComponent(Layout(), container);
    },

    isMounted: function() {
      return !!layout;
    },

    update: function(props) {
      layout.setProps(deserialize(props));
    },

    unmount: function() {
      if (this.isMounted()) {
        return this.unmount();
      }
    }
  };

  singleton = new CQS();

  return singleton;
});