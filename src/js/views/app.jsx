/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Summary = require('jsx!./summary');
  var I18n = require('i18n!quiz_statistics');
  var _ = require('lodash');
  var QuestionRenderer = require('jsx!./question');
  var MultipleChoiceRenderer = require('jsx!./questions/multiple_choice');

  var extend = _.extend;
  var Renderers = {
    'multiple_choice_question': MultipleChoiceRenderer,
    'true_false_question': MultipleChoiceRenderer,
  };

  var Statistics = React.createClass({
    getDefaultProps: function() {
      return {
        quizStatistics: {},
        submissionStatistics: {},
        questionStatistics: [],
      };
    },

    render: function() {
      var props = this.props;
      var submissionStatistics = props.submissionStatistics;
      var questionStatistics = props.questionStatistics;

      return(
        <div id="canvas-quiz-statistics">
          <section>
            <Summary
              pointsPossible={props.quizStatistics.pointsPossible}
              scoreAverage={submissionStatistics.scoreAverage}
              scoreHigh={submissionStatistics.scoreHigh}
              scoreLow={submissionStatistics.scoreLow}
              scoreStdev={submissionStatistics.scoreStdev}
              durationAverage={submissionStatistics.durationAverage}
              quizReports={[]}
              scores={submissionStatistics.scores}
              />
          </section>

          <section id="question-statistics-section">
            <header className="padded">
              <h3 className="section-title inline">
                {I18n.t('question_breakdown', 'Question Breakdown')}
              </h3>

              <aside className="pull-right">
              </aside>
            </header>

            {questionStatistics.map(this.renderQuestion.bind(null, props))}
          </section>
        </div>
      );
    },

    renderQuestion: function(props, question) {
      var renderer = Renderers[question.questionType] || QuestionRenderer;
      var questionProps = extend({}, question, {
        key: 'question-' + question.id,
        participantCount: props.submissionStatistics.uniqueCount
      });

      return renderer(questionProps);
    }
  });

  return Statistics;
});