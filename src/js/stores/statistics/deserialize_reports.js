define(function(require) {
  var convertCase = require('../../util/convert_case');
  var K = require('../../constants');
  var _ = require('lodash');
  var pick = _.pick;
  var camelize = convertCase.camelize;

  var extract = function(set, keys) {
    return camelize(pick(set || {}, keys));
  };

  return function deserializeReports(payload) {
    return payload.quiz_reports.map(function(quiz_report) {
      return extract(quiz_report, K.QUIZ_REPORT_ATTRS);
    });
  };
});