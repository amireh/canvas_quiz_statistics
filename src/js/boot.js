define(function(require) {
  var VERSION = require('./version');
  var config = require('./config');
  var delegate = require('./core/delegate');
  var exports = {};

  exports.mount = delegate.mount;
  exports.isMounted = delegate.isMounted;
  exports.update = delegate.update;
  exports.unmount = delegate.unmount;
  exports.version = VERSION;
  exports.config = config;

  return exports;
});