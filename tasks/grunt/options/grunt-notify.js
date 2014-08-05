var grunt = require('grunt');

module.exports = {
  js: {
    options: {
      message: "<%= grunt.config.appName %> JS has been compiled.",
    }
  },

  less: {
    options: {
      message: "<%= grunt.config.appName %> CSS has been compiled."
    }
  },

  docs: {
    options: {
      message: "<%= grunt.config.appName %> API docs have been generated."
    }
  },
};