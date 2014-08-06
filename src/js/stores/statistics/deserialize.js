define(function(require) {
  var convertCase = require('../../util/convert_case');
  var K = require('../../constants');
  var _ = require('lodash');
  var pick = _.pick;
  var findWhere = _.findWhere;
  var camelize = convertCase.camelize;

  var extract = function(set, keys) {
    return camelize(pick(set || {}, keys));
  };

  return function deserialize(payload) {
    var props = {};

    if (payload.hasOwnProperty('quiz_statistics')) {
      payload = payload.quiz_statistics;

      if (Array.isArray(payload)) {
        payload = payload[0];
      }
    }

    props.submissionStatistics =
      extract(payload.submission_statistics, K.SUBMISSION_STATISTICS_ATTRS);

    props.questionStatistics = (payload.question_statistics || []).map(function(questionStatistics) {
      var props = extract(questionStatistics, K.QUESTION_STATISTICS_ATTRS);

      if (props.pointBiserials) {
        props.discriminationIndex = findWhere(props.pointBiserials, {
          correct: true
        }).point_biserial;
      }

      return props;
    });

    props.quizStatistics = extract(payload, K.QUIZ_STATISTICS_ATTRS);

    return props;
  };
});