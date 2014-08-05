module.exports = {
  description: 'Release a new version of the application.',
  runner: function (grunt, type) {
    grunt.task.run('test');
    grunt.task.run('bumpup:' + ( type || 'patch' ));
    grunt.task.run('updatePkg');
    grunt.task.run('string-replace:version');
    grunt.task.run('build');
    grunt.task.run('tagrelease');
    grunt.task.run('development');
  }
};