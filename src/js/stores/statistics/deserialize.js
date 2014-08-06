define(function(require) {
  var convertCase = require('../../util/convert_case');
  var _ = require('lodash');
  var pick = _.pick;
  var camelize = convertCase.camelize;

  // A whitelist of the attributes we need from the payload.
  var QUIZ_STATISTICS_ATTRS = [
    'id'
  ];

  var SUBMISSION_STATISTICS_ATTRS = [
    'score_average',
    'score_high',
    'score_low',
    'score_stdev',
    'duration_average',
    'unique_count'
  ];

  var QUESTION_STATISTICS_ATTRS = [
    'id',
    'question_type',
    'question_text',
    'responses',
    'answers'
  ];

  return function deserialize(payload) {
    var props = {};

    if (payload.hasOwnProperty('quiz_statistics')) {
      payload = payload.quiz_statistics;

      if (Array.isArray(payload)) {
        payload = payload[0];
      }
    }

    props.submissionStatistics = camelize(pick(payload.submission_statistics, SUBMISSION_STATISTICS_ATTRS));

    props.questionStatistics = (payload.question_statistics || []).map(function(questionStatistics) {
      return pick(questionStatistics, QUESTION_STATISTICS_ATTRS);
    }).map(camelize);

    props.quizStatistics = pick(payload, QUIZ_STATISTICS_ATTRS);

    return props;
  };
});