define(function() {
  return function wrap(arr) {
    return Array.isArray(arr) ?
      arr :
      arr ?
        [ arr ] :
        [];
  };
});