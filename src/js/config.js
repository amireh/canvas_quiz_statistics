define(function(require) {
  var _ = require('lodash');
  var ProductionConfig = require('./config/environments/production');
  var DevelopmentConfig = require('./config/environments/development');
  var config = ProductionConfig || {};

  //>>excludeStart("production", pragmas.production);
  _.merge(config, DevelopmentConfig || {});
  //>>excludeEnd("production");

  return config;
});
