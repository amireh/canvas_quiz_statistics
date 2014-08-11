define(function(require) {
  var Subject = require('stores/statistics');
  var RSVP = require('rsvp');
  var Adapter = require('core/adapter');
  var config = require('config');
  var _ = require('lodash');
  var quizStatisticsFixture = require('json!fixtures/quiz_statistics_all_types.json');
  var quizReportsFixture = require('json!fixtures/quiz_reports.json');
  var mapBy = _.map;

  describe('Stores.Statistics', function() {
    this.promiseSuite = true;
    this.xhrSuite = true;

    afterEach(function() {
      Subject.__reset__();
    });

    describe('#load', function() {
      it('should load and deserialize stats and reports', function() {
        var onChange = jasmine.createSpy('onChange');
        var quizStats, quizReports;

        config.quizStatisticsUrl = '/stats';
        config.quizReportsUrl = '/reports';

        this.respondWith('GET', '/stats', xhrResponse(200, quizStatisticsFixture));
        this.respondWith('GET', '/reports', xhrResponse(200, quizReportsFixture));

        Subject.addChangeListener(onChange);
        Subject.load();
        this.respond();

        quizStats = Subject.getQuizStatistics();
        quizReports = Subject.getQuizReports();

        expect(quizStats).toBeTruthy();
        expect(quizStats.id).toEqual('200');

        expect(quizReports.length).toBe(2);
        expect(mapBy(quizReports, 'id').sort()).toEqual([ '200', '201' ]);

        expect(onChange).toHaveBeenCalled();
      });
    });
  });
});