require('core-js');
let $ = require('jquery');

require('../lib/clusterErrors.js');

let loadJSON = require('../lib/loadJSON.js');
let loadCSV = require('../lib/loadCSV.js');

import * as d3 from 'd3';
import {
    Geoplot
} from '../plot/Geoplot.js';

export function initGeoplots() {

    // let colors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395"];
    let colors = ['#F26D21', '#EBC944', '#C02F1D'];

    plotJSON(
        './../../data/top_25_samlet.json',
        './../../data/nycboroughboundaries.geojson',
        colors
    );
}

function plotJSON(dataFile, geoFile, colors) {

    let promises = loadJSON.loadJSON([
        dataFile,
        geoFile
    ]);

    let width = 950;
    let height = 800;

    //Create SVG element
    let svg = d3.select(".svgContainerGeo")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    Promise.all(promises).then(function(values) {

        let data = values[0];
        let geodata = values[1];

        let geoPlot = new Geoplot(height, width, geodata, data);

        geoPlot.plot(svg, colors);
    });
}
