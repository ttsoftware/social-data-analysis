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
        './data/top_25_samlet.json',
        './data/nycboroughboundaries.geojson',
        colors
    );
}

function plotJSON(dataFile, geoFile, colors) {

    let promises = loadJSON.loadJSON([
        dataFile,
        geoFile
    ]);

    let width = 700;
    let height = 800;

    //Create SVG elements
    let svgAccidents = d3.select(".svgContainerGeoAccidents")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    let svgRatio = d3.select(".svgContainerGeoRatio")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    Promise.all(promises).then(function(values) {

        let data = values[0];
        let geodata = values[1];

        let geoPlotAccidents = new Geoplot(height, width, geodata, data);
        let geoPlotRatio = new Geoplot(height, width, geodata, data);

        geoPlotAccidents.plot(
            svgAccidents,
            (d) => {
                return d['ACCIDENTS'] / 70;
            },
            colors
        );

        geoPlotRatio.plot(
            svgRatio,
            (d) => {
                return d['RATIO'] * 30;
            },
            colors
        );

        legendGeo(
            '#legendGeoAccident',
            colors, [
                'Most injuries',
                'Most accidents',
                'Top 25 injuries & accidents',
            ]);

        legendGeo(
            '#legendGeoRatio',
            colors, [
                'Most injuries',
                'Most accidents',
                'Top 25 injuries & accidents',
            ]);
    });
}

function legendGeo(selector, colors, categories) {

    d3.select(selector).append('ul');

    categories.forEach(function(category, i) {

        let listElement = d3.select(selector + ' ul')
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
