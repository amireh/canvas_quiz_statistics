define(function(require) {
  var convertCase = require('../util/convert_case');
  var camelize = convertCase.camelize;

  var deserialize = function(payload) {
    var props = {};
    var quizStats = payload;

    if (payload.hasOwnProperty('quiz_statistics')) {
      quizStats = payload.quiz_statistics;

      if (Array.isArray(quizStats)) {
        quizStats = quizStats[0];
      }
    }

    props.submissionStatistics = camelize(quizStats.submission_statistics);
    props.questionStatistics = (quizStats.question_statistics || []).map(camelize);
    props.quiz = camelize(payload.quiz || {});

    return props;
  };

  return deserialize;
});