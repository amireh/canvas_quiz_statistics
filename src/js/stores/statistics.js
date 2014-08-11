define(function(require) {
  var Store = require('../core/store');
  var Adapter = require('../core/adapter');
  var config = require('../config');
  var RSVP = require('rsvp');
  var deserialize = require('./statistics/deserialize');
  var deserializeReports = require('./statistics/deserialize_reports');
  var data = {};
  var quizReports = [];
  var onError = config.onError;

  var store = new Store('statistics', {
    /**
     * Load quiz statistics.
     * Requires config.quizStatisticsUrl to be set.
     *
     * @async
     * @emit change
     */
    load: function() {
      var stats, reports;

      if (!config.quizStatisticsUrl) {
        return onError('Missing configuration parameter "quizStatisticsUrl".');
      }
      else if (!config.quizReportsUrl) {
        return onError('Missing configuration parameter "quizReportsUrl".');
      }

      stats = Adapter.request({
        type: 'GET',
        url: config.quizStatisticsUrl
      }).then(function(quizStatisticsPayload) {
        data = deserialize(quizStatisticsPayload);
      });

      reports = Adapter.request({
        type: 'GET',
        url: config.quizReportsUrl
      }).then(function(quizReportsPayload) {
        quizReports = deserializeReports(quizReportsPayload);
      });

      return RSVP.all([ stats, reports ]).then(function() {
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
    },

    getQuizReports: function() {
      return quizReports;
    },

    actions: {
      generateReport: function(reportType, onChange, onError) {
        Adapter.request({
          type: 'POST',
          url: config.quizReportsUrl,
          data: {
            quiz_reports: [{
              report_type: reportType,
              includes_all_versions: true
            }],
            include: ['progress', 'file']
          }
        }).then(onChange, onError);
      }
    },

    __reset__: function() {
      data = {};
      quizReports = [];
      return Store.prototype.__reset__.call(this);
    }
  });

  return store;
});