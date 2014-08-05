/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var t = require('i18n!quiz_statistics');
  var Question = require('jsx!../question');
  var CorrectAnswerDonut = require('jsx!../charts/correct_answer_donut');
  var RatioCalculator = require('../../../util/ratio_calculator');
  var round = require('../../../util/round');

  var MultipleChoice = React.createClass({
    getInitialState: function() {
      return {
        participantCount: 0,
        showingDetails: false,
        correctResponseRatio: 0
      };
    },

    isShowingDetails: function() {
      return this.props.showDetails === undefined ?
        this.state.showingDetails :
        this.props.showDetails;
    },

    componentDidMount: function() {
      var calculator = new RatioCalculator(this.props.questionType, {
        answerPool: this.props.answers,
        participantCount: this.props.participantCount
      });

      this.setState({
        calculator: calculator,
        correctResponseRatio: calculator.getRatio()
      });
    },

    componentWillReceiveProps: function(nextProps) {
      this.updateCalculator(nextProps);
    },

    updateCalculator: function(props) {
      this.state.calculator.setAnswerPool(this.props.answers);
      this.state.calculator.setParticipantCount(this.props.participantCount);
      this.setState({
        correctResponseRatio: this.state.calculator.getRatio()
      });
    },

    render: function() {
      var crr = this.state.correctResponseRatio;
      var attemptsLabel = t('attempts', 'Attempts: __count__ out of __total__', {
        count: this.props.answeredStudentCount,
        total: this.props.participantCount
      });
      var correctResponseRatioLabel = t('correct_response_ratio', {
        defaultValue: '%{ratio}% of your students correctly answered this question.',
        ratio: round(crr * 100.0, 0)
      });

      return(
        <Question>
          <header>
            <span className="question-attempts">{attemptsLabel}</span>
            <aside className="pull-right">
              <button onClick={this.toggleDetails} className="btn">
                {this.isShowingDetails() ?
                  <i className="icon-collapse" /> :
                  <i className="icon-expand" />
                }
              </button>
            </aside>

            <div
              className="question-text"
              dangerouslySetInnerHTML={{ __html: this.props.questionText }}
              />
          </header>

          <div>
            <section className="correct-answer-ratio-section">
              <CorrectAnswerDonut
                correctResponseRatio={this.state.correctResponseRatio}>
                <p><strong>{t('correct_answer', 'Correct answer')}</strong></p>
                <p>{correctResponseRatioLabel}</p>
              </CorrectAnswerDonut>
            </section>
          </div>
        </Question>
      );
    },

    toggleDetails: function(e) {
      e.preventDefault();

      this.setState({
        showingDetails: !this.state.showingDetails
      });
    }
  });

  return MultipleChoice;
});