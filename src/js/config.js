define(function(require) {
  var _ = require('lodash');
  var ProductionConfig = require('./config/environments/production');
  var DevelopmentConfig = require('./config/environments/development');
  var config = ProductionConfig || {};

  //>>excludeStart("production", pragmas.production);
  _.merge(config, DevelopmentConfig || {});
  //>>excludeEnd("production");

  /**
   * @cfg {Function} ajax
   * An XHR request processor that has an API compatible with jQuery.ajax.
   */
  config.ajax = undefined;

  config.quizStatisticsUrl = undefined;

  config.loadOnStartup = true;

  return config;
});