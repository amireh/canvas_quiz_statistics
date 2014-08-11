/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Report = React.createClass({
    getDefaultProps: function() {
      return {
        label: 'Analysis Report'
      };
    },

    render: function() {
      return(
        <div className="report-generator inline">
          <i className="icon-analytics" /> {this.props.label}
        </div>
      );
    }
  });

  return Report;
});