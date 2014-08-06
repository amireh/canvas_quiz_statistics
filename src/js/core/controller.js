define(function(require) {
  var statisticsStore = require('../stores/statistics');
  var deserialize = require('./deserializer');
  var config = require('../config');
  var update;

  var onChange = function() {
    var props = deserialize(statisticsStore.get());

    update(props);
  };

  return {
    start: function(_update) {
      update = _update;
      statisticsStore.addChangeListener(onChange);

      if (config.loadOnStartup) {
        if (config.quizStatisticsUrl) {
          statisticsStore.load();
        }
        else {
          console.warn(
            'You have requested to load on start-up, but have not',
            'provided a url to load from in CQS.config.quizStatisticsUrl.'
          );
        }
      }
    },

    stop: function() {
      statisticsStore.removeChangeListener(onChange);
      update = undefined;
    }
  };
});