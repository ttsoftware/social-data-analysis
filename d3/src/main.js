require('core-js');
let plotly = require('plotly');
let $ = require('jquery');

let loadJSON = require('./loadJSON.js');

import * as d3 from 'd3';
import {
    Geoplot
} from './plot/Geoplot.js';

$(function() {

    $('#clusterSelect').on('change', function() {

        console.log($(this).val());

        $('.svgContainer').html('');

        plotJSON(
            './src/data_fest/prostitutiondata_' + $(this).val() + '.json',
            './src/data_fest/sfpddistricts.geojson'
        );
    });

    $('#clusterSelect').trigger('change');


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
    let svg = d3.select(".svgContainer")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    Promise.all(promises).then(function(values) {

        let pdata = values[0];
        let geodata = values[1];
        let k2 = values[2];
        k2 = [];

        console.log(values);

        let geoPlot = new Geoplot(height, width, geodata, pdata, k2);

        geoPlot.plot(svg, colors);
    });
}
