var grunt = require('grunt');

module.exports = {
  js: {
    options: {
      message: "<%= grunt.pkg.name %> JS has been compiled.",
    }
  },

  less: {
    options: {
      message: "<%= grunt.pkg.name %> CSS has been compiled."
    }
  },

  docs: {
    options: {
      message: "<%= grunt.pkg.name %> API docs have been generated."
    }
  },
};