require('core-js');

import * as d3 from 'd3';
import {
    Plot
} from './Plot.js';
import {
    ScatterPlotDataPoint
} from './ScatterPlotDataPoint.js';

export class ScatterPlot extends Plot {

    /**
     * @param dataPoints - Expects an array of ScatterPlotDataPoint
     */
    constructor(height, width, xAxis, yAxis, dataPoints) {
        super(height, width, xAxis, yAxis);

        this.dataPoints = dataPoints;

        // Scale the range of the data
        // extent returns the min and the max
        this.xAxis.domain(d3.extent(dataPoints, function(dataPoint) {
            return dataPoint.x;
        }));

        this.yAxis.domain(d3.extent(dataPoints, function(dataPoint) {
            return dataPoint.y;
        }));
    }

    /**
     * Add the scatterplot
     * @param svg - the DOM svg element
     */
    plot(svg) {

        // avoid scoping issues
        let instance = this;

        // Append the plot to the svg
        let dots = svg.selectAll("g.dot")
            .data(this.dataPoints)
            .enter()
            .append("g");

        // Add the dots
        dots.append("circle")
            .attr("class", "dot")
            .attr("r", function (dataPoint) {
                return Math.log(dataPoint.y);
            })
            .attr("cx", function(dataPoint) {
                return instance.xAxis(dataPoint.x);
            })
            .attr("cy", function(dataPoint) {
                return instance.yAxis(dataPoint.y);
            });

        // Add the labels at (x, y)
        dots.append("text")
            .attr("class", "text")
            .attr("x", function(dataPoint) {
                return instance.xAxis(dataPoint.x);
            })
            .attr("y", function(dataPoint) {
                return instance.yAxis(dataPoint.y);
            })
            .attr("dx", ".5em")
            .attr("dy", ".3em")
            .text(function(dataPoint) {
                return dataPoint.y;
            });

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.xAxis));

        // Add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(this.yAxis));
    }
}
