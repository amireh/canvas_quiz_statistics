/* jshint node:true */
module.exports = function(grunt) {
  'use strict';

  var config;
  var glob = require('glob');

  var readPackage = function() {
    return grunt.file.readJSON('package.json');
  };

  var loadOptions = function(path, config) {
    glob.sync('*', { cwd: path }).forEach(function(option) {
      var key = option.replace(/\.js$/,'').replace(/^grunt\-/, '');
      config[key] = require(path + option);
    });
  };

  var loadTasks = function(path) {
    glob.sync('*.js', { cwd: path }).forEach(function(taskFile) {
      var taskRunner;
      var taskName = taskFile.replace(/\.js$/, '').replace(/_/g, ':');
      var task = require(path + '/' + taskFile);

      taskRunner = task.runner;

      if (taskRunner instanceof Function) {
        taskRunner = taskRunner.bind(null, grunt);
      }

      grunt.registerTask(taskName, task.description, taskRunner);
    });
  };

  config = {
    appName: 'Canvas Quiz Statistics',
    pkg: readPackage(),
    env: process.env,
  };

  grunt.pkg = config.pkg;
  grunt.moduleId = 'canvas_quiz_statistics';

  grunt.initConfig(config);
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-bumpup');
  grunt.loadNpmTasks('grunt-tagrelease');
  grunt.loadNpmTasks('grunt-jsvalidate');
  grunt.loadNpmTasks('grunt-jsduck');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-connect-rewrite');
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-symlink');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-spritesmith');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-copy');

  loadOptions('./tasks/grunt/options/', config);
  loadTasks('./tasks/grunt');

  grunt.registerTask('updatePkg', function () {
    grunt.config.set('pkg', readPackage());
  });

  grunt.registerTask('default', [
    'development',
    'connect:tests',
    'watch'
  ]);
};
