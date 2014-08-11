define([], function() {
  return {
    // Number of decimals to round to when displaying floats.
    precision: 2,

    /**
     * @cfg {Function} ajax
     * An XHR request processor that has an API compatible with jQuery.ajax.
     */
    ajax: undefined,

    quizStatisticsUrl: undefined,
    quizReportsUrl: undefined,

    loadOnStartup: true,

    /**
     * Error emitter. Default behavior is to log the error message to the
     * console.
     *
     * Override this to handle errors from the app.
     *
     * @param  {String} message
     *         An explanation of the error.
     */
    onError: function(message) {
      console.error(message);
    }
  };
});
