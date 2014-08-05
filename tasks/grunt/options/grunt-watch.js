module.exports = {
  options: {
    spawn: false,
  },

  css: {
    files: '{src,vendor}/css/**/*.{less,css}',
    tasks: [ 'less', 'notify:less' ]
  },

  compiled_css: {
    files: "dist/<%= grunt.pkg.name %>.css",
    tasks: [ 'noop' ],
    options: {
      livereload: {
        port: 9124
      }
    }
  },

  docs: {
    files: [ '.jsduck', 'doc/guides/**/*.md', 'doc/*.*' ],
    tasks: [ 'docs', 'notify:docs' ]
  },

  jsx: {
    files: 'src/js/**/*.jsx',
    tasks: [ 'newer:react', 'jshint:jsx' ]
  },

  tests: {
    files: [ 'src/js/**/*.j{s,sx}', 'test/**/*' ],
    tasks: [ 'jasmine:unit' ],
  },
};
