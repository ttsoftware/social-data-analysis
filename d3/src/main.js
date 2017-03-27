require('core-js');
let plotly = require('plotly');
let $ = require('jquery');

let loadJSON = require('./loadJSON.js');

import * as d3 from 'd3';
import {Geoplot} from './plot/Geoplot.js';

$(function() {

    let promises = loadJSON.loadJSON([
        './src/data_fest/prostitutiondata_k2.json',
        './src/data_fest/sfpddistricts.geojson',
        //'./src/data_fest/prostitutiondata_k2.json'
    ]);

    let width = 950;
    let height = 800;
    let colors = ['red', 'yellow'];

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
});
