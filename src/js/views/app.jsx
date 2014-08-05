/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Summary = require('jsx!./statistics/summary');
  var t = require('i18n!quiz_statistics');
  var _ = require('underscore');
  var deserialize = require('../core/deserializer');

  var extend = _.extend;
  var QuestionRenderer = require('jsx!./statistics/question');
  var MultipleChoiceRenderer = require('jsx!./statistics/questions/multiple_choice');
  var Renderers = {
    'multiple_choice_question': MultipleChoiceRenderer
  };

  var Statistics = React.createClass({
    getDefaultProps: function() {
      return {
        quiz_statistics: [],
        quiz: {}
      };
    },

    render: function() {
      var props = deserialize(this.props);

      return(
        <div id="quiz-statistics">
          <section>
            <Summary
              pointsPossible={props.quiz.pointsPossible}
              scoreAverage={props.submissionStatistics.scoreAverage}
              scoreHigh={props.submissionStatistics.scoreHigh}
              scoreLow={props.submissionStatistics.scoreLow}
              scoreStdev={props.submissionStatistics.scoreStdev}
              durationAverage={props.submissionStatistics.durationAverage}
              quizReports={[]}
              />
          </section>

          <section id="question-statistics-section">
            <header className="padded">
              <h3 className="section-title inline">
                {t('question_breakdown', 'Question Breakdown')}
              </h3>

              <aside className="pull-right">
              </aside>
            </header>

            {props.questionStatistics.map(this.renderQuestion.bind(null, props))}
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