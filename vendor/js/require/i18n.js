/** @license
 * RequireJS plugin for namespacing i18next transalations.
 * Author: Ahmad Amireh
 * Version: 0.1.0 (2014/04/05)
 * Released under the MIT license
 */
define([ 'i18next', 'react' ], function(I18n, React) {
  return {
    load : function(name, req, onLoad, config) {
      var namespace = 'ns_' + name.replace(/\//g, '.');
      var t = function() {
        var value;
        var params = Array.prototype.slice.call(arguments, 0);
        var key = params.shift();
        params.unshift([ namespace, key ].join('.'));

        return I18n.t.apply(I18n.t, params);
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