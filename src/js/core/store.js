define(function(require) {
  var _ = require('lodash');
  var extend = _.extend;

  var Store = function(key, proto) {
    this._key = key;
    this.__reset__();
    extend(this, proto || {});
    return this;
  };

  extend(Store.prototype, {
    actions: {},
    addChangeListener: function(callback) {
      this._callbacks.push(callback);
    },

    removeChangeListener: function(callback) {
      var index = this._callbacks.indexOf(callback);
      if (index > -1) {
        this._callbacks.splice(index, 1);
      }
    },

    emitChange: function() {
      this._callbacks.forEach(function(callback) {
        callback();
      });
    },

    __reset__: function() {
      this._callbacks = [];
    }
  });

  return Store;
});