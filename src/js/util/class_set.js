define(function(require) {
  var React = require('react');
  var classSet = (React.addons || {}).classSet || function classSet(set) {
    return Object.keys(set).reduce(function(classes, key) {
      if (!!set[key]) {
        classes.push(key);
      }

      return classes;
    }, []).join(' ');
  };

  return classSet;
});