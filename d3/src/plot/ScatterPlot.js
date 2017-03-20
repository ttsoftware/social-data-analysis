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
        svg.selectAll("dot")
            .data(this.dataPoints)
            .enter()
            .append("circle")
            .attr("r", 3)
            .attr("cx", function(dataPoint) {
                return instance.xAxis(dataPoint.x);
            })
            .attr("cy", function(dataPoint) {
                return instance.yAxis(dataPoint.y);
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
