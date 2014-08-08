var grunt = require('grunt');
var _ = require('lodash');
var convert = require('rjs_converter');
var merge = _.merge;

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
    moduleId: grunt.moduleId
  },

  paths: {
    'rsvp': 'empty:',
    'lodash': 'empty:',
    'react': 'empty:',
    'd3': 'empty:',
  },

  wrap: {
    start: [
      // The following declaration must be set at the very first line of the
      // output for i18n extraction to allow multiple scopes within the same
      // file.
      "/* canvas_precompiled_asset: true */",

      // App name and version, for cools.
      "/* <%= grunt.moduleId %> <%= grunt.pkg.version %> */",

      ""
    ].join("\n")
  },

  rawText: {
  },

  name: "<%= grunt.moduleId %>",
  include: [ "<%= grunt.moduleId %>/boot" ],
  exclude: [ 'text', 'jsx', 'i18n' ],

  onBuildWrite: function (moduleName, path, contents) {
    return convert(contents
      // Text and JSX modules get inlined by the post-processor and become
      // regular modules so get rid of the plugin prefix in module ids:
      .replace(/(text!|jsx!)/g, '')

      // Rewrite all modules that start with "canvas_packages/" to be without
      // that prefix since when they're embedded in Canvas, the module IDs will
      // just match:
      .replace(/(['"])canvas_packages\//g, "$1")
    );
  }
};

// Alias "boot" to the module id:
//
// This allows to do the following for an app named "canvas_quizzes":
//
//    require([ 'canvas_quizzes' ], function(app) {
//      app.mount(document.body);
//    });
//
// Instead of:
//
//    require([ 'canvas_quizzes/boot' ]);
baseOptions.rawText[grunt.moduleId] =
  "define(['<%= grunt.moduleId %>/boot'], function(arg) { return arg; });"

module.exports = {
  debug: {
    options: merge({}, baseOptions, {
      optimize: 'none',
      out: "dist/<%= grunt.moduleId %>.js",
    })
  },

  minified: {
    options: merge({}, baseOptions, {
      out: "dist/<%= grunt.moduleId %>.min.js",
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
    })
  },
};