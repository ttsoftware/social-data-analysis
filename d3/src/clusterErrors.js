require('core-js');
let $ = require('jquery');

import * as d3 from 'd3';

$(function() {
    var lineData = [{
            x: 2,
            y: 2.79415714437
        },
        {
            x: 3,
            y: 0.958035509702
        },
        {
            x: 4,
            y: 0.738803684681
        },
        {
            x: 5,
            y: 0.557951441553
        },
        {
            x: 6,
            y: 0.463413402307
        }
    ];

    var margin = {
            top: 20,
            right: 20,
            bottom: 70,
            left: 70
        },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var valueline = d3.line()
        .x(function(d) {
            return x(d.x);
        })
        .y(function(d) {
            return y(d.y);
        });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#clusterErrors").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data
    x.domain(d3.extent(lineData, function(d) {
        return d.x;
    }));
    y.domain([0, d3.max(lineData, function(d) {
        return d.y;
    })]);

    svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .text("Number of clusters");

    svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2.5))
        .attr("y", -50)
        .text("Sum of errors");

    // Add the valueline path.
    svg.append("path")
        .data([lineData])
        .attr("class", "line")
        .attr("d", valueline);

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5, "s"));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

});
