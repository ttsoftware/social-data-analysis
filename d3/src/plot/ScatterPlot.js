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
    }

    /**
     * Add the scatterplot
     * @param svg - the DOM svg element
     * @param colors - optional color input
     */
    plot(svg, colors) {

        // avoid scoping issues
        let instance = this;

        if (!colors) {
            // generate a color for each dataPoint
            let colors = new Array(this.dataPoints.length)
                .fill(0)
                .map(function(e) {
                    return "hsl(" + Math.random() * 360 + ", 100%, 50%)";
                });
        }

        // scale signif values
        let minTotal = d3.min(this.dataPoints, function(dataPoint) {
            return dataPoint.ySignificance;
        });

        let normalizedSignif = new Array(this.dataPoints.length).fill(0);
        this.dataPoints.forEach(function(dataPoint, i) {
            normalizedSignif[i] = (dataPoint.ySignificance / minTotal) * 8;
        });

        // Append the plot to the svg
        let dots = svg.selectAll("g.dot")
            .data(this.dataPoints)
            .enter()
            .append("g");

        // Add the dots
        dots.append("circle")
            .attr("fill", function(dataPoint, i) {
                return colors[i];
            })
            .attr("r", function(dataPoint, i) {
                return normalizedSignif[i];
            })
            .attr("cx", function(dataPoint) {
                return instance.xAxis(dataPoint.x);
            })
            .attr("cy", function(dataPoint) {
                return instance.yAxis(dataPoint.y);
            });

        let formatSignif = d3.format(".0f");

        // Add the labels at (x, y)
        dots.append("text")
            .attr("class", "text")
            .attr("x", function(dataPoint) {
                return instance.xAxis(dataPoint.x);
            })
            .attr("y", function(dataPoint) {
                return instance.yAxis(dataPoint.y);
            })
            .attr("dx", function(dataPoint, i) {
                return normalizedSignif[i] * 0.1 + 'em';
            })
            .attr("dy", function(dataPoint) {
                return ".3em";
            })
            .text(function(dataPoint) {
                return formatSignif(dataPoint.ySignificance, 4);
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
