define(function(require) {
  var React = require('react');
  var _ = require('lodash');
  var config = require('../config');
  var initialize = require('../config/initializer');
  var Layout = require('jsx!../views/app');
  var controller = require('./controller');
  var extend = _.extend;
  var layout;
  var exports = {};

  var configure = function(options) {
    extend(config, options);
  };

  /**
   * Start the app and perform any necessary data loading.
   *
   * @param  {HTMLElement} node
   *         The node to mount the app in.
   *
   * @param  {Object} [options={}]
   *         Options to configure the app with. See config.js
   *
   * @return {RSVP.Promise}
   *         Fulfilled when the app has been started and rendered.
   */
  var mount = function(node, options) {
    configure(options);
    config.container = node;

    return initialize().then(function() {
      layout = React.renderComponent(Layout(), config.container);
      controller.start(update);
    });
  };

  var isMounted = function() {
    return !!layout;
  };

  var update = function(props) {
    layout.setProps(props);
  };

  var reload = function() {
    controller.load();
  };

  var unmount = function() {
    if (isMounted()) {
      controller.stop();
      React.unmountComponentAtNode(config.container);
      config.container = undefined;
    }
  };


  exports.configure = configure;
  exports.mount = mount;
  exports.isMounted = isMounted;
  exports.update = update;
  exports.reload = reload;
  exports.unmount = unmount;

  return exports;
});