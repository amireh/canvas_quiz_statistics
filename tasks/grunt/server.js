module.exports = {
  description: 'Serve the application using a local Connect server.',
  runner: function(grunt, target) {
    grunt.task.run([
      'configureRewriteRules',
      'connect:www'
    ]);
  }
};