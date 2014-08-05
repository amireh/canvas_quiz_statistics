module.exports = {
  options: {
    spawn: false,
  },

  css: {
    files: '{src,vendor}/css/**/*.{less,css}',
    tasks: [ 'less', 'notify:less' ]
  },

  compiled_css: {
    files: 'dist/*.css',
    tasks: [ 'noop' ],
    options: {
      livereload: {
        port: 9224
      }
    }
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
