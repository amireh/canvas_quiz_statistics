/** @license
 * RequireJS plugin for namespacing i18next transalations.
 * Author: Ahmad Amireh
 * Version: 0.1.0 (2014/04/05)
 * Released under the MIT license
 */
define([ 'react' ], function(I18n, React) {
  var INTERPOLATER = /\%\{([^\}]+)\}/g;

  return {
    load : function(name, req, onLoad, config) {
      var namespace = 'ns_' + name.replace(/\//g, '.');
      var t = function(key, value, options) {
        var params = Array.prototype.slice.call(arguments, 0);
        var key = [ namespace, key ].join('.');

        if (arguments.length === 2 && typeof value === 'string') {
          options = { defaultValue: value };
        }
        else {
          options = value;
        }

        // TODO: proxy to Canvas's I18n.t
        var value = ''+options.defaultValue;
        var variables = value.match(INTERPOLATER);

        if (variables) {
          variables.forEach(function(variable) {
            var optionKey = variable.substr(2, variable.length - 3);
            value = value.replace(new RegExp(variable, 'g'), options[optionKey]);
          });
        }

        return value;
      };

      t.htmlSafe = function() {
        return React.DOM.span({
          dangerouslySetInnerHTML: { __html: t.apply(t, arguments) }
        });
      };

      onLoad(t);
    }
  };
});