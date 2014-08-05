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
    'inflection': 'empty:',
  },

  wrap: {
    start: "/** <%= grunt.pkg.name %> <%= grunt.pkg.version %> */\n",
  },

  name: "<%= grunt.moduleId %>",
  create: true,
  include: [ "<%= grunt.moduleId %>/boot" ],
  exclude: [ 'text', 'jsx' ],

  onBuildWrite: function (moduleName, path, singleContents) {
    return singleContents.replace(/(text!|jsx!)/g, '');
  }
};

module.exports = {
  debug: {
    options: extend({}, baseOptions, {
      optimize: 'none',
      out: "dist/<%= grunt.pkg.name %>-<%= grunt.pkg.version %>.js",
    })
  },

  minfied: {
    options: extend({}, baseOptions, {
      optimize: 'uglify2',
      out: "dist/<%= grunt.pkg.name %>-<%= grunt.pkg.version %>.min.js",

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
      },
    })
  }
};