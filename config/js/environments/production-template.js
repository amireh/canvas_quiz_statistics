/* src/js/config/environments/production.js */
define([], function() {
  /**
   * @class Config
   *
   * Application-wide configuration.
   */
  return {
    version: '1.0.0',
    canvasHost: '/api/v1',

    // Number of decimals to round to when displaying floats.
    precision: 2,

    xhr: {
      timeout: 15000,
    }
  };
});
