define(function() {
  var INTERPOLATER = /\%\{([^\}]+)\}/g;

  return function interpolate(contents, options) {
    var variables = contents.match(INTERPOLATER);

    if (variables) {
      variables.forEach(function(variable) {
        var optionKey = variable.substr(2, variable.length - 3);
        contents = contents.replace(new RegExp(variable, 'g'), options[optionKey]);
      });
    }

    return contents;
  };
});