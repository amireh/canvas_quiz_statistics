/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Summary = require('jsx!./statistics/summary');
  var I18n = require('i18n!quiz_statistics');
  var _ = require('lodash');

  var extend = _.extend;
  var QuestionRenderer = require('jsx!./statistics/question');
  var MultipleChoiceRenderer = require('jsx!./statistics/questions/multiple_choice');
  var Renderers = {
    'multiple_choice_question': MultipleChoiceRenderer
  };

  var Statistics = React.createClass({
    getDefaultProps: function() {
      return {
        quiz: {},
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
        <div id="quiz-statistics">
          <section>
            <Summary
              pointsPossible={props.quiz.pointsPossible}
              scoreAverage={submissionStatistics.scoreAverage}
              scoreHigh={submissionStatistics.scoreHigh}
              scoreLow={submissionStatistics.scoreLow}
              scoreStdev={submissionStatistics.scoreStdev}
              durationAverage={submissionStatistics.durationAverage}
              quizReports={[]}
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