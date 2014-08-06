/* global requirejs: false, jasmine: false */
requirejs.config({
  baseUrl: './src/js',
  map: {
    '*': {
      'test': '../../test',
      'fixtures': 'test/fixtures'
    }
  },

  paths: {
    'json': '../../vendor/js/require/json',
    'jasmine_rsvp': '../../node_modules/jasmine-rsvp/dist/jasmine-rsvp-full',

    // jQuery is needed by jasmine-react
    'jquery': '../../node_modules/jquery/dist/jquery',
    'jasmine_react': '../../node_modules/jasmine-react/dist/jasmine_react',
  },

  deps: [
    'json',
    'jasmine_react',
    'jasmine_rsvp'
  ],

  waitSeconds: 1,

  callback: function() {
    this.__TESTING__ = true;

    // Avoid infinite loop in the pretty printer when trying to print objects with
    // circular references.
    jasmine.MAX_PRETTY_PRINT_DEPTH = 3;

    // Hide the global "launchTest" that the grunt-contrib-requirejs-template
    // unconditionally calls without respecting our callback. We must initialize
    // the app before any of the specs are run.
    this.launchTests = this.launchTest;
    this.launchTest = function() {};

    require([ 'test/boot' ], function() {});
  }
});