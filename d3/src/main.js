require('core-js');
let $ = require('jquery');

require('./clusterErrors.js');

let loadJSON = require('./loadJSON.js');
let loadCSV = require('./loadCSV.js');

import * as d3 from 'd3';
import {
    Geoplot
} from './plot/Geoplot.js';
import {
    ScatterPlotDataPoint
} from './plot/ScatterPlotDataPoint.js';
import {
    ScatterPlot
} from './plot/ScatterPlot.js';

$(function() {

    $('#clusterSelect').on('change', function() {

        $('.svgContainerGeo').html('');

        plotJSON(
            './src/data_fest/prostitutiondata_' + $(this).val() + '.json',
            './src/data_fest/sfpddistricts.geojson',
            './src/data_fest/' + $(this).val() + '.json'
        );
    });

    $('#clusterSelect').trigger('change');

    let margin = {
        top: 20,
        right: 50,
        bottom: 50,
        left: 70
    };

    // define the same axis for both plots
    let xAxis = d3.scaleLinear();
    let yAxis = d3.scaleLinear();

    let csvPromises = loadCSV.loadCSV(['crimedata2003.csv', 'crimedata2015.csv']);

    Promise.all(csvPromises).then(function(values) {
        let data2003 = values[0];
        let data2015 = values[1];

        // generate a color for each dataPoint
        let colors = new Array(10)
            .fill(0)
            .map(function(e) {
                return "hsl(" + Math.random() * 360 + ", 100%, 50%)";
            });

        // generate a list of categories
        let categories = new Array(10)
            .fill(0)
            .map(function(e, i) {
                return data2003[i].category;
            });

        // add the legend
        legend(colors, categories);

        $('#yearSelect').on('change', function(event) {

            // change the year
            $('.svgContainerScatter').html('');

            let width = d3.select('.svgContainerScatter').node().getBoundingClientRect().width -
                margin.left - margin.right;
            let height = d3.select('.plot').node().getBoundingClientRect().height -
                margin.top - margin.bottom;

            // get the svg
            let svg = d3.select(".svgContainerScatter")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Scale the range of the data
            // extent returns the min and the max
            let extentX = d3.extent(data2003, function(dataPoint) {
                return dataPoint.x;
            });
            let xRange = extentX[1] - extentX[0];
            let extentY = d3.extent(data2003, function(dataPoint) {
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
            switch (+$(this).val()) {
                case 2003:
                    plotCSV(svg, xAxis, yAxis, height, width, colors, categories, data2003);
                    break;
                case 2015:
                    plotCSV(svg, xAxis, yAxis, height, width, colors, categories, data2015);
                    break;
            }
        });

        // select the first element by default
        $('#yearSelect').trigger('change');
    });
});

function plotJSON(prostitutionFile, geoFile, clusterFile) {

    let promises = loadJSON.loadJSON([
        prostitutionFile,
        geoFile,
        clusterFile
    ]);

    let width = 950;
    let height = 800;
    let colors = ['red', 'yellow', 'blue', 'green', 'magenta'];

    //Create SVG element
    let svg = d3.select(".svgContainerGeo")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    Promise.all(promises).then(function(values) {

        let pdata = values[0];
        let geodata = values[1];
        let k2 = values[2];

        let geoPlot = new Geoplot(height, width, geodata, pdata, k2);

        geoPlot.plot(svg, colors);
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
    scatterPlot.axisLabels(svg, "Prostitution", "Vehicle Theft");
    scatterPlot.plot(svg, categories, colors);
}

function legend(colors, categories) {

    if (d3.select('.legend ul').node()) {
        // only add the legend once
        return;
    }

    d3.select('.legend').append('ul');

    colors.forEach(function(color, i) {

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
            .attr("fill", color);

        listElement.append('span')
            .text(categories[i]);
    });
}
