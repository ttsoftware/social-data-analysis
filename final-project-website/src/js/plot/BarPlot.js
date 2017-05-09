require('core-js');

import * as d3 from 'd3';
import {
    Plot
} from './Plot.js';
import {
    ScatterPlotDataPoint
} from './ScatterPlotDataPoint.js';

export class BarPlot extends Plot {

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
            colors = new Array(this.dataPoints.length)
                .fill(0)
                .map(function(e) {
                    return "hsl(" + Math.random() * 360 + ", 100%, 50%)";
                });
        }

        let barPadding = 1;
        let formatSignif = d3.format(".0f");

        // Append the tooltip div
        let tooltip = d3.select("body")
            .append("div")
            .attr("class", "text")
            .style("opacity", 0);

        // Append the plot to the svg
        let bars = svg.selectAll("g.bar")
            .data(this.dataPoints)
            .enter()
            .append("g")
            .on("mousemove", function(dataPoint, i) {
                tooltip.style("opacity", 1);
                tooltip.html(
                        '<span style="color: #161515">Accidents</span>: ' + dataPoint.Number + '<br>' +
                        '<span style="color: #161515">Effect</span>: ' + dataPoint.Effect
                    )
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 10) + "px")
                    .style("background-color", '#C02F1D');
            })
            .on("mouseout", function(dataPoint) {
                tooltip.style("opacity", 0);
            });

        bars
            .append("rect")
            .attr("fill", function(d) {
                return "rgb(" + (Math.round((1 / d.Importance)* 2000000)) + ", 0, 0)";
            })
            .attr("x", function(d, i) {
                return i * (instance.width / instance.dataPoints.length) //Bar width of 20 plus 1 for padding
            })
            .attr("y", function(d) {
                return instance.height - (d.Importance / 150); //Height minus data value
            })
            .attr("width", instance.width / instance.dataPoints.length - barPadding)
            .attr("height", function(d) {
                return d.Importance / 150;
            });

        bars
            .append("text")
            .text(function(d) {
                return Math.round(d.Importance);
            })
            .attr("x", function(d, i) {
                return i * (instance.width / instance.dataPoints.length) + (instance.width / instance.dataPoints.length - barPadding) / 2;
            })
            .attr("y", function(d) {
                return instance.height - (d.Importance / 150) + 15;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("fill", "white")
            .attr("text-anchor", "middle");

        // // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.xAxis))
            .selectAll("text")
            .attr("font-size", "14px")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(75)")
            .style("text-anchor", "start");

        // Add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(this.yAxis));
    }
}
