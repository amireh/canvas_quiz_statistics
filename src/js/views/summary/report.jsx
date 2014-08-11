/** @jsx React.DOM */
define(function(require) {
  var React = require('../../ext/react');
  var Report = React.createClass({
    mixins: [ React.addons.ActorMixin ],

    propTypes: {
      generatable: React.PropTypes.bool
    },

    getDefaultProps: function() {
      return {
        readableType: 'Analysis Report',
        generatable: false,
        downloadUrl: undefined
      };
    },

    render: function() {
      return (
        <div className="report-generator inline">{
          this.props.generatable ?
            this.renderGenerator() :
            this.renderDownloader()
          }
        </div>
      );
    },

    renderGenerator: function() {
      return (
        <button onClick={this.onGenerate} className="btn btn-link generate-report">
          <i className="icon-analytics" /> {this.props.readableType}
        </button>
      );
    },

    renderDownloader: function() {
      return(
        <a href={this.props.downloadUrl} className="btn btn-link">
          <i className="icon-analytics" /> {this.props.readableType}
        </a>
      );
    },

    onGenerate: function(e) {
      e.preventDefault();

      this.sendAction('statistics:generateReport', this.props.reportType);
    }
  });

  return Report;
});