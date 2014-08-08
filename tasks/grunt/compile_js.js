module.exports = {
  description: 'Build an optimized version of the JavaScript sources.',
  runner: [
    'symlink:compiled',
    'shim_canvas_packages',
    'requirejs',
    'clean:compiled_symlink'
  ]
};