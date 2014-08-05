var shell = require('shelljs');

module.exports = {
  description: 'Use the development, non-optimized JS sources.',
  runner: function(grunt) {
    shell.exec('rm dist/app.js &> /dev/null');
    shell.exec('cd dist; ln -s ../src/js/main.js ./app.js');
    shell.exec('cd www/; ln -s ../src ./');
    shell.exec('cd www/; ln -s ../vendor ./');
    shell.exec('cd www/; ln -s ../dist ./');

    grunt.task.run('compile:css');
  }
};