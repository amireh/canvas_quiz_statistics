/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var K = require('../../../constants');
  var Text = require('jsx!../../../components/text');
  var I18n = require('i18n!quiz_statistics');

  var Help = React.createClass({
    render: function() {
      return(
        <div>
          <div dangerouslySetInnerHTML={{ __html: I18n.t("discrimination_index_help", "<p> This metric provides a measure of how well a single question can tell the difference (or discriminate) between students who do well on an exam and those who do not. </p> <p> More information is available <a href=\"%{article_url}\" target=\"_blank\">here</a>. </p>", {"article_url":K.DISCRIMINATION_INDEX_HELP_ARTICLE_URL}) }} />

          <span>Separator</span>

          <div dangerouslySetInnerHTML={{ __html: I18n.t("adooken", "Adooken!", {}) }} />
        </div>
      );
    }
  });

  return Help;
});