/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var I18n = require('i18n!statistics/summary');
  var secondsToTime = require('../../util/seconds_to_time');
  var round = require('../../util/round');

  var Summary = React.createClass({
    getDefaultProps: function() {
      return {
        quizReports: [],
        pointsPossible: 0,
        scoreAverage: 0,
        scoreHigh: 0,
        scoreLow: 0,
        scoreStdev: 0,
        durationAverage: 0
      };
    },

    ratioFor: function(score) {
      var quizPoints = parseFloat(this.props.pointsPossible);

      if (quizPoints > 0) {
        return round(score / quizPoints * 100.0, 0);
      }
      else {
        return 0;
      }
    },

    render: function() {
      return(
        <div id="summary-statistics">
          <header className="padded">
            <h3 className="section-title inline">{I18n.t('quiz_summary', 'Quiz Summary')}</h3>

            <aside className="pull-right">
              {this.props.quizReports.map(this.renderReport)}
            </aside>
          </header>

          <table className="text-left">
            <thead>
              <tr>
                <th>
                  <i className="icon-quiz-stats-avg"></i>
                  {I18n.t('stats_mean', 'Avg Score')}
                </th>
                <th>
                  <i className="icon-quiz-stats-high"></i>
                  {I18n.t('stats_high', 'High Score')}
                </th>
                <th>
                  <i className="icon-quiz-stats-low"></i>
                  {I18n.t('stats_low', 'Low Score')}
                </th>
                <th>
                  <i className="icon-quiz-stats-deviation"></i>
                  {I18n.t('stats_stdev', 'Std. Deviation')}
                </th>
                <th>
                  <i className="icon-quiz-stats-time"></i>
                  {I18n.t('stats_avg_time', 'Avg Time')}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="emphasized">
                  {this.ratioFor(this.props.scoreAverage)}%
                </td>
                <td>{this.ratioFor(this.props.scoreHigh)}%</td>
                <td>{this.ratioFor(this.props.scoreLow)}%</td>
                <td>{(this.props.scoreStdev).toFixed(2)}</td>
                <td>{secondsToTime(this.props.durationAverage)}</td>
              </tr>
            </tbody>
          </table>

          {this.renderChart()}
        </div>
      );
    },

    renderReport: function(report) {
      return <div />
    },

    renderChart: function() {
      // <svg className="chart"></svg>
      return false;
    }
  });

  return Summary;
});