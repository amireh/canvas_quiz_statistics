define(function(require) {
  var Store = require('../core/store');
  var Adapter = require('../core/adapter');
  var config = require('../config');
  var stats;

  var store = new Store('items', {
    load: function() {
      if (!config.quizStatisticsUrl) {
        throw "Can not load: missing required configuration parameter 'quizStatisticsUrl'";
      }

      Adapter.request({
        type: 'GET',
        url: config.quizStatisticsUrl
      }).then(function(quizStatistics) {
        stats = quizStatistics;
        store.emitChange();
      });
    },

    get: function() {
      return stats;
    }
  });

  return store;
});