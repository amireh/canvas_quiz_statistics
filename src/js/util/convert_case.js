define(function(require) {
  var InflectionJS = require('inflection');

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
    camelize: function(props) {
      var prop;
      var attrs = {};

      for (prop in props) {
        if (props.hasOwnProperty(prop)) {
          attrs[prop.underscore().camelize(true)] = props[prop];
        }
      }

      return attrs;
    },

    underscore: function(props) {
      var prop;
      var attrs = {};

      for (prop in props) {
        if (props.hasOwnProperty(prop)) {
          attrs[prop.underscore()] = props[prop];
        }
      }

      return attrs;
    },

    toString: function(props, key) {
      convertProp(props, key, function(value) {
        return ''+value;
      });
    },

    toInteger: function(props, key) {
      convertProp(props, key, function(value) {
        return parseInt(value, 10);
      });
    }
  };
});