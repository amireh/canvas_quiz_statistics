/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var d3 = require('d3');
  var K = require('../../constants');
  var I18n = require('i18n!quiz_statistics');
  var classSet = require('../../util/class_set');

  var divide = function(x, y) {
    return (parseFloat(x) / y) || 0;
  };

  var Chart = React.createClass({
    getDefaultProps: function() {
      return {
        correct: [],
        total: [],
        ratio: []
      };
    },

    componentDidMount: function() {
      this.createChart(this.getDOMNode(), this.props);
    },

    shouldComponentUpdate: function(nextProps) {
      this.updateChart(nextProps);
      return false;
    },

    createChart: function(node, props) {
      var barHeight, barWidth, svg;

      barHeight = props.height / 3;
      barWidth = props.width / 2;

      svg = d3.select(node)
        .attr('width', props.width)
        .attr('height', props.height)
        .append('g');

      svg.selectAll('.bar.correct')
        .data(props.ratio)
        .enter()
          .append('rect')
          .attr('class', 'bar correct')
          .attr('x', barWidth)
          .attr('width', function(correctRatio) {
            return correctRatio * barWidth;
          }).attr('y', function(d, bracket) {
            return bracket * barHeight;
          }).attr('height', function() {
            return barHeight - 1;
          });

      svg.selectAll('.bar.incorrect')
        .data(props.ratio)
        .enter()
          .append('rect')
          .attr('class', 'bar incorrect')
          .attr('x', function(correctRatio) {
            return -1 * (1 - correctRatio * barWidth);
          }).attr('width', function(correctRatio) {
            return (1 - correctRatio) * barWidth;
          }).attr('y', function(d, bracket) {
            return bracket * barHeight;
          }).attr('height', function() {
            return barHeight - 1;
          });

      this.__svg = svg;
    },

    updateChart: function(props) {
      this.removeChart();
      this.createChart(this.getDOMNode(), props);
    },

    removeChart: function() {
      this.__svg.remove();
      this.__svg = undefined;
    },

    componentWillUnmount: function() {
      this.removeChart();
    },

    render: function() {
      return(
        <svg className="chart" />
      );
    }
  });

  var DiscriminationIndex = React.createClass({
    getDefaultProps: function() {
      return {
        width: 270,
        height: 14 * 3,
        discriminationIndex: 0,
        topStudentCount: 0,
        middleStudentCount: 0,
        bottomStudentCount: 0,
        correctTopStudentCount: 0,
        correctMiddleStudentCount: 0,
        correctBottomStudentCount: 0,
      };
    },

    render: function() {
      var di = this.props.discriminationIndex;
      var sign = di > K.DISCRIMINATION_INDEX_THRESHOLD ? '+' : '-';
      var className = {
        'index': true,
        'positive': sign === '+',
        'negative': sign !== '+'
      };

      var chartData;
      var stats = {
        top: {
          correct: this.props.correctTopStudentCount,
          total: this.props.topStudentCount,
        },
        mid: {
          correct: this.props.correctMiddleStudentCount,
          total: this.props.middleStudentCount,
        },
        bot: {
          correct: this.props.correctBottomStudentCount,
          total: this.props.bottomStudentCount,
        }
      };

      chartData = {
        correct: [
          stats.top.correct, stats.mid.correct, stats.bot.correct
        ],

        total: [
          stats.top.total, stats.mid.total, stats.bot.total
        ],

        ratio: [
          divide(stats.top.correct, stats.top.total),
          divide(stats.mid.correct, stats.mid.total),
          divide(stats.bot.correct, stats.bot.total)
        ]
      };

      chartData.width = this.props.width;
      chartData.height = this.props.height;

      return (
        <div>
          <p>
            <em className={classSet(className)}>
              <span className="sign">{sign}</span>
              {Math.abs(this.props.discriminationIndex.toFixed(2))}
            </em>

            <strong>{I18n.t('discrimination_index', 'Discrimination Index')}</strong>

            <i
              onClick={this.showHelpDialog}
              className="chart-help-trigger icon-question" />
          </p>

          {Chart(chartData)}
        </div>
      );
    }
  });

  return DiscriminationIndex;
});