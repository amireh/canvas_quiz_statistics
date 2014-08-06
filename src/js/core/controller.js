define(function(require) {
  var statisticsStore = require('../stores/statistics');
  var config = require('../config');
  var update;

  var onChange = function() {
    update({
      quizStatistics: statisticsStore.getQuizStatistics(),
      submissionStatistics: statisticsStore.getSubmissionStatistics(),
      questionStatistics: statisticsStore.getQuestionStatistics(),
    });
  };

  var Controller = {
    start: function(_update) {
      update = _update;
      statisticsStore.addChangeListener(onChange);

      if (config.loadOnStartup) {
        Controller.load();
      }
    },

    load: function() {
      if (config.quizStatisticsUrl) {
        statisticsStore.load();
      }
      else {
        console.warn(
          'You have requested to load on start-up, but have not',
          'provided a url to load from in CQS.config.quizStatisticsUrl.'
        );
      }
    },

    stop: function() {
      statisticsStore.removeChangeListener(onChange);
      update = undefined;
    }
  };

  return Controller;
});