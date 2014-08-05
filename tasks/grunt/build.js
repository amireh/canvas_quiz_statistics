module.exports = {
  description: 'Build a production-ready version.',
  runner: [
    'clean:compiled_symlink',
    'clean:compiled_jsx',
    'copy:src',
    'react',
    'compile:js',
    'compile:css'
  ]
};