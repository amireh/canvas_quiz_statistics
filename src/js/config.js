define([
  'lodash',
  './config/environments/production',
  //>>excludeStart("production", pragmas.production);
  './config/environments/development'
  //>>excludeEnd("production");
], function(_, ProductionConfig, DevelopmentConfig) {
  var config = ProductionConfig || {};

  //>>excludeStart("production", pragmas.production);
  _.merge(config, DevelopmentConfig || {});
  //>>excludeEnd("production");

  return config;
});