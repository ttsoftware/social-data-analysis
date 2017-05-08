require('core-js');
let $ = require('jquery');

require('../lib/clusterErrors.js');

let loadJSON = require('../lib/loadJSON.js');
let loadCSV = require('../lib/loadCSV.js');

import * as d3 from 'd3';
import {
    BarPlot
} from '../plot/BarPlot.js';

export function initRegression() {

    let colors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395"];

    let margin = {
        top: 20,
        right: 50,
        bottom: 200,
        left: 100
    };

    // define the same axis for both plots
    let xAxis = d3.scaleBand();
    let yAxis = d3.scaleLinear();

    $('.barPlot').html('');

    // let width = d3.select('.barPlot').node().getBoundingClientRect().width - margin.left - margin.right;
    // let height = d3.select('.plot').node().getBoundingClientRect().height - margin.top - margin.bottom;

    let width = 600;
    let height = 500;

    // get the svg
    let svg = d3.select(".barPlot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    plotJSON('../../data/regression_data.json', svg, height, width, xAxis, yAxis, colors)
}


function plotJSON(dataFile, svg, height, width, xAxis, yAxis, colors) {

    let promises = loadJSON.loadJSON([
        dataFile
    ]);

    Promise.all(promises).then(function(values) {

        let data = values[0];

        // Scale the range of the data
        // extent returns the min and the max
        let extentY = d3.extent(data, function(dataPoint) {
            return dataPoint.Importance;
        });
        let yRange = extentY[1] - extentY[0];

        xAxis.range([0, width])
            .domain(data.map(d => d.Cause));

        yAxis.domain([
            0,
            extentY[1] + (yRange * .05)
        ]);

        let barPlot = new BarPlot(height, width, xAxis, yAxis, data);
        barPlot.axisLabels(svg, "", "Estimated number people injuried");
        barPlot.plot(svg, colors);
    });
}
