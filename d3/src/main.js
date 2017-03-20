require('core-js');
var plotly = require('plotly');
var $ = require('jquery');

import * as d3 from 'd3';
import {
    ScatterPlotDataPoint
} from './plot/ScatterPlotDataPoint.js';
import {
    ScatterPlot
} from './plot/ScatterPlot.js';

$(function() {

    // require custom files after DOM has loaded
    // require('./scatter/scatter.js');

    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // parse the date / time
    var parseTime = d3.timeParse("%d-%b-%y");

    var svg = d3.select("#svgContainer")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Get the data
    d3.csv("data.csv", function(error, data) {
        if (error) throw error;

        // format the data
        let dataPoints = data.map(function(d) {
            return new ScatterPlotDataPoint(parseTime(d.date), +d.close);
        });

        let xAxis = d3.scaleTime();
        let yAxis = d3.scaleLinear()

        let scatterPlot = new ScatterPlot(height, width, xAxis, yAxis, dataPoints);
        scatterPlot.plot(svg);
    });
});
