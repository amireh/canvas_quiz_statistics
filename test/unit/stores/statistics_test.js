define(function(require) {
  var Subject = require('stores/statistics');
  var RSVP = require('rsvp');
  var Adapter = require('core/adapter');
  var config = require('config');
  var quizStatisticsFixture = require('json!fixtures/quiz_statistics.json');

  describe('Stores.Statistics', function() {
    var onChange;

    this.promiseSuite = true;

    beforeEach(function() {
      onChange = jasmine.createSpy('onChange');
      Subject.__reset__();
    });

    describe('#load', function() {
      it('should work', function() {
        config.quizStatisticsUrl = '/foobar';
        spyOn(Adapter, 'request').and.returnValue(RSVP.resolve(quizStatisticsFixture));
        Subject.addChangeListener(onChange);
        Subject.load();

        expect(Subject.get()).toBeFalsy();

        this.flush();

        expect(Subject.get()).toBeTruthy();
        expect(onChange).toHaveBeenCalled();
      });
    });
  });
});