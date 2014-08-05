module.exports = {
  description: 'Run the Jasmine unit tests.',
  runner: [
    'symlink:assets',
    'connect:tests',
    'jasmine:unit',
    'clean:assets'
  ]
};