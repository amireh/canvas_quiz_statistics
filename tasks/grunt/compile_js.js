module.exports = {
  description: 'Build an optimized version of the JavaScript sources.',
  runner: [
    'symlink:compiled',
    'requirejs',
    'clean:compiled_symlink'
  ]
};