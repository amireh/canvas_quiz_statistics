/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var K = require('../../../constants');

  var helpArticleUrl = K.DISCRIMINATION_INDEX_HELP_ARTICLE_URL;

  // TODO: React block i18n
  var Help = React.createClass({
    render: function() {
      return(
        <div>
          <p>
            This metric provides a measure of how well a single question can tell the
            difference (or discriminate) between students who do well on an exam and
            those who do not.

            It divides students into three groups based on their score on the whole
            quiz and displays those groups by who answered the question correctly.
            </p>

            <p>
            More information is available
            <a target="_blank" href={helpArticleUrl}>here</a>.
          </p>
        </div>
      );
    }
  });

  return Help;
});