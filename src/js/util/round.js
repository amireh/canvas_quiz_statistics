define([], function() {
  return function round(n, digits) {
    var x;

    digits = digits === undefined ? 0 : digits;

    if (typeof n !== 'number' || !(n instanceof Number)) {
      n = parseFloat(n);
    }

    x = Math.pow(10, digits);

    return Math.round(n * x) / x;
  }
});