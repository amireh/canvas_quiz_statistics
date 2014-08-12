var shell = require('shelljs');

module.exports = {
  description: 'Use the development, non-optimized JS sources.',
  runner: function(grunt) {
    shell.exec('cd www/; ln -s ../src ./');
    shell.exec('cd www/; ln -s ../vendor ./');
    shell.exec('cd www/; ln -s ../dist ./');
    shell.exec('cd www/; ln -s ../vendor/canvas/public/font ./');
    shell.exec('cd www/; ln -s ../vendor/canvas/public/images ./');
    shell.exec('cd www/; ln -s ../test/fixtures ./');

    grunt.task.run('compile_css');
  }
};