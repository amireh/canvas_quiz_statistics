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

    loadOnStartup: true
  };
});
