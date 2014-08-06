var grunt = require('grunt');
var moduleId = grunt.moduleId;
var _ = require('lodash');
var extend = _.extend;

var baseOptions = {
  baseUrl: 'tmp/js',
  mainConfigFile: "tmp/js/<%= grunt.moduleId %>/main.js",
  optimize: 'none',

  removeCombined:           false,
  inlineText:               true,
  preserveLicenseComments:  false,

  pragmas: {
    production: true
  },

  jsx: {
    moduleId: moduleId
  },

  paths: {
    'rsvp': 'empty:',
    'lodash': 'empty:',
    'react': 'empty:',
    'd3': 'empty:',
  },

  wrap: {
    start: "/* <%= grunt.moduleId %> <%= grunt.pkg.version %> */\n",
  },

  rawText: {
  },

  name: "<%= grunt.moduleId %>",
  include: [ "<%= grunt.moduleId %>/boot" ],
  exclude: [ 'text', 'jsx', 'i18n' ],

  onBuildWrite: function (moduleName, path, singleContents) {
    return singleContents.replace(/(text!|jsx!)/g, '').replace(",'./initializers/debug'", '');
  }
};

var minifiedOptions = {
  optimize: 'uglify2',

  uglify2: {
    warnings: true,
    mangle:   true,

    output: {
      beautify: false
    },

    compress: {
      sequences:  true,
      dead_code:  true,
      loops:      true,
      unused:     true,
      if_return:  true,
      join_vars:  true
    }
  }
};

baseOptions.rawText[grunt.moduleId] =
  "define(['<%= grunt.moduleId %>/boot'], function(arg) { return arg; });"

baseOptions.rawText[grunt.moduleId + '/config/initializers/debug'] =
  "define([], {});"

module.exports = {
  debug: {
    options: extend({}, baseOptions, {
      optimize: 'none',
      out: "dist/<%= grunt.moduleId %>.js",
    })
  },

  minified: {
    options: extend({}, baseOptions, minifiedOptions, {
      out: "dist/<%= grunt.moduleId %>.min.js",
    })
  },
};