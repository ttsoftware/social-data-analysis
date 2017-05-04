require('core-js');
let $ = require('jquery');

require('./lib/clusterErrors.js');

let loadJSON = require('./lib/loadJSON.js');
let loadCSV = require('./lib/loadCSV.js');

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

// Declare javascript in separate scope
$(function() {

    // handle navigation
    $('.nav li a').click((event) => {

        // remove all 'active' classes
        $('.nav li').removeClass('active');

        let id = event.target.id;
        let anchor = $('#' + id);

        fetch('/pages/' + id + '.html').then((response) => {
            return response.text();
        }).then((text) => {
            // set this nav element as active
            anchor.parent().addClass('active');
            $('#content-container').html(text);
        });
    });

    // initialize front page
    $('#frontpage').click();
});
