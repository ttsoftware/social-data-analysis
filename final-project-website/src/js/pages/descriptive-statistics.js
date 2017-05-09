require('core-js');
let $ = require('jquery');

require('../lib/clusterErrors.js');

let loadJSON = require('../lib/loadJSON.js');
let loadCSV = require('../lib/loadCSV.js');

import * as d3 from 'd3';
import {
    ScatterPlotDataPoint
} from '../plot/ScatterPlotDataPoint.js';
import {
    ScatterPlot
} from '../plot/ScatterPlot.js';

export function initDescriptive() {

    // let colors = [
    //     '#C3C3C3',
    //     '#918c8c',
    //     '#4e5050',
    //     '#303032',
    //     '#0d0c0c',
    // ];

    let colors = ["#91000d",
        "#c70e69",
        "#b16500",
        "#9f742d",
        "#fd003b",
        "#ff0058",
        "#d77a5f",
        "#bca737",
        "#ff9b4c",
        "#fdba35"
    ];

    // let colors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395"];

    let margin = {
        top: 20,
        right: 50,
        bottom: 70,
        left: 70
    };

    // define the same axis for both plots
    let xAxis = d3.scaleLinear();
    let yAxis = d3.scaleLinear();

    let csvPromises = loadCSV.loadCSV([
            './data/trafficdata2013.csv',
            './data/trafficdata2014.csv',
            './data/trafficdata2015.csv',
            './data/trafficdata2016.csv',
        ],
        'Injury per 100000 inhabitant',
        'Accident per 100000 inhabitant',
        'RATIO',
        'BOROUGH'
    );

    Promise.all(csvPromises).then(function(values) {

        let yearData = {
            2013: values[0],
            2014: values[1],
            2015: values[2],
            2016: values[3],
        }

        let yearsDataPoints = values.reduce((previous, current) => previous.concat(Object.values(current)));

        // generate a list of categories
        let categories = new Array(5)
            .fill(0)
            .map(function(e, i) {
                return yearData[2013][i].category;
            });

        // add the legend
        legend(colors, categories);

        $('#yearSelect').on('change', function(event) {

            // change the year
            $('.boroughInjuriesContainer').html('');

            let width = d3.select('.boroughInjuriesContainer').node().getBoundingClientRect().width - margin.left - margin.right;
            let height = d3.select('.plot').node().getBoundingClientRect().height - margin.top - margin.bottom;

            // get the svg
            let svg = d3.select(".boroughInjuriesContainer")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Scale the range of the data
            // extent returns the min and the max
            let extentX = d3.extent(yearsDataPoints, function(dataPoint) {
                return dataPoint.x;
            });
            let xRange = extentX[1] - extentX[0];
            let extentY = d3.extent(yearsDataPoints, function(dataPoint) {
                return dataPoint.y;
            });
            let yRange = extentY[1] - extentY[0];

            xAxis.domain([
                extentX[0] - (xRange * .05),
                extentX[1] + (xRange * .05)
            ]);
            yAxis.domain([
                0,
                extentY[1] + (yRange * .05)
            ]);

            // switch the plot
            plotCSV(svg, xAxis, yAxis, height, width, colors, categories, yearData[+$(this).val()]);
        });

        // select the first element by default
        $('#yearSelect').trigger('change');
    });
}

function plotCSV(svg, xAxis, yAxis, height, width, colors, categories, dataPoints) {

    let scatterPlot = new ScatterPlot(
        height,
        width,
        xAxis,
        yAxis,
        dataPoints
    );
    scatterPlot.axisLabels(svg, "Injury per 100,000 inhabitants", "Accident per 100,000 inhabitants");
    scatterPlot.plot(svg, categories, colors);
}

function legend(colors, categories) {

    if (d3.select('.legend ul').node()) {
        // only add the legend once
        return;
    }

    d3.select('.legend').append('ul');

    categories.forEach(function(category, i) {

        let listElement = d3.select('.legend ul')
            .append('li');

        listElement
            .append("svg")
            .attr("class", "color-rect")
            .attr("width", 15)
            .attr("height", 15)
            .append("rect")
            .attr("height", 15)
            .attr("width", 15)
            .attr("fill", colors[i]);

        listElement.append('span')
            .text(category);
    });
}
