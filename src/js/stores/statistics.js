define(function(require) {
  var Store = require('../core/store');
  var Adapter = require('../core/adapter');
  var config = require('../config');
  var deserialize = require('./statistics/deserialize');
  var data = {};

  var store = new Store('statistics', {
    /**
     * Load quiz statistics.
     * Requires config.quizStatisticsUrl to be set.
     *
     * @async
     * @emit change
     */
    load: function() {
      if (!config.quizStatisticsUrl) {
        throw "Can not load: missing required configuration parameter 'quizStatisticsUrl'";
      }

      Adapter.request({
        type: 'GET',
        url: config.quizStatisticsUrl
      }).then(function(quizStatisticsPayload) {
        data = deserialize(quizStatisticsPayload);
        store.emitChange();
      });
    },

    getQuizStatistics: function() {
      return data.quizStatistics;
    },

    getSubmissionStatistics: function() {
      return data.submissionStatistics;
    },

    getQuestionStatistics: function() {
      return data.questionStatistics;
    }
  });

  return store;
});