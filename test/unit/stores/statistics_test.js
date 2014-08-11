define(function(require) {
  var Subject = require('stores/statistics');
  var RSVP = require('rsvp');
  var Adapter = require('core/adapter');
  var config = require('config');
  var quizStatisticsFixture = require('json!fixtures/quiz_statistics_all_types.json');

  describe('Stores.Statistics', function() {
    this.promiseSuite = true;

    afterEach(function() {
      Subject.__reset__();
    });

    describe('#load', function() {
      it('should work', function() {
        var onChange = jasmine.createSpy('onChange');
        var quizStats;

        config.quizStatisticsUrl = '/foobar';
        spyOn(Adapter, 'request').and.returnValue(RSVP.resolve(quizStatisticsFixture));
        Subject.addChangeListener(onChange);
        Subject.load();

        expect(Subject.getQuizStatistics()).toBeFalsy();

        this.flush();

        quizStats = Subject.getQuizStatistics();

        expect(quizStats).toBeTruthy();
        expect(quizStats.id).toEqual('200');
        expect(onChange).toHaveBeenCalled();
      });
    });
  });
});