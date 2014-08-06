define(function(require) {
  var Inflections = require('./inflections');
  var camelizeStr = Inflections.camelize;

  var convertProp = function(props, key, converter) {
    if (props[key] !== undefined) {
      if (Array.isArray(props[key])) {
        props[key] = props[key].map(function(value) {
          return value !== undefined ? converter(value) : value;
        });
      }
      else {
        props[key] = converter(props[key]);
      }
    }
  };

  return {
    // Convert all property keys in an object to camelCase
    camelize: function(props) {
      var prop;
      var attrs = {};

      for (prop in props) {
        if (props.hasOwnProperty(prop)) {
          attrs[camelizeStr(prop, true)] = props[prop];
        }
      }

      return attrs;
    },
  };
});