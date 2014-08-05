module.exports = {
  version: {
    files: {
      'src/js/version.js': 'src/js/version.js'
    },
    options: {
      replacements: [{
        pattern: /\d\.\d{1,}\.\d+/,
        replacement: "<%= grunt.config.get('pkg.version') %>"
      }]
    }
  },
};