/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var d3 = require('d3');

  var CIRCLE = 2 * Math.PI;
  var FMT_PERCENT = d3.format('%');

  var Chart = React.createClass({
    componentDidMount: function() {
      this.createChart(this.getDOMNode(), this.props);
    },

    shouldComponentUpdate: function(nextProps, nextState) {
      this.updateChart(nextProps);
      return false
    },

    createChart: function(node, props) {
      var ratio = props.correctResponseRatio;
      var diameter = props.diameter;
      var radius = diameter / 2;

      var arc = d3.svg.arc()
        .innerRadius(radius)
        .outerRadius(diameter / 2.5)
        .startAngle(0);

      var svg = d3.select(node)
        .attr('width', radius)
        .attr('height', radius)
        .append('g')
          .attr('transform', 'translate(' + radius + ',' + radius + ')');

      var background = svg.append('path')
        .datum({ endAngle: CIRCLE })
        .attr('class', 'background')
        .attr('d', arc);

      var foreground = svg.append('path')
        .datum({ endAngle: CIRCLE * ratio })
        .attr('class', 'foreground')
        .attr('d', arc);

      var text = svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .text(FMT_PERCENT(ratio));

      this.__svg = svg;
    },

    updateChart: function(props) {
      console.info("Updating d3 chart with new props:", props);
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

  var CorrectAnswerDonut = React.createClass({
    propTypes: {
      correctResponseRatio: React.PropTypes.number.isRequired
    },

    getDefaultProps: function() {
      return {
        /**
         * @config {Number} [radius=80]
         *         Diameter of the donut chart in pixels.
         */
        diameter: 80,
        correctResponseRatio: 0,
        children: []
      };
    },

    render: function() {
      return (
        <div>
          {this.transferPropsTo(Chart())}

          <div className="auxiliary">
            {this.props.children}
          </div>
        </div>
      )
    }
  });

  return CorrectAnswerDonut;
});