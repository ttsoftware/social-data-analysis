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
    plot(svg, categories, colors) {

        // avoid scoping issues
        let instance = this;
        let instanceDataPoints = $.extend(true, [], this.dataPoints);

        if (!colors) {
            // generate a color for each dataPoint
            let colors = new Array(instanceDataPoints.length)
                .fill(0)
                .map(function(e) {
                    return "hsl(" + Math.random() * 360 + ", 100%, 50%)";
                });
        }

        let formatSignif = d3.format(".0f");

        // scale signif values
        let minTotal = d3.min(instanceDataPoints, function(dataPoint) {
            return dataPoint.ySignificance;
        });

        let normalizedSignif = new Array(instanceDataPoints.length).fill(0);
        instanceDataPoints.forEach(function(dataPoint, i) {
            normalizedSignif[i] = (dataPoint.ySignificance / minTotal) * 8;
        });

        // Append the tooltip div
        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "text")
            .style("opacity", 0);

        // Append the plot to the svg
        let dots = svg.selectAll("g.dot")
            .data(instanceDataPoints)
            .enter()
            .append("g")
            .on("mousemove", function(dataPoint, i) {
                tooltip.style("opacity", 1);
                tooltip.html(
                        categories[i] + '<br>' +
                        '<span style="color: #161515">Accidents</span>: ' + formatSignif(dataPoint.y, 4) + '<br>' +
                        '<span style="color: #161515">Injuries</span>: ' + formatSignif(dataPoint.x, 4) + '<br>' +
                        '<span style="color: #161515">Ratio</span>: ' + formatSignif(dataPoint.ySignificance * 100, 4) + '%'
                    )
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 10) + "px")
                    .style("background-color", '#C02F1D');
            })
            .on("mouseout", function(dataPoint, i) {
                tooltip.style("opacity", 0);
            });

        // Add the dots
        dots.append("circle")
            .attr("fill", function(dataPoint, i) {
                return colors[i];
            })
            .attr("r", function(dataPoint, i) {
                return normalizedSignif[i];
            })
            .transition()
            .ease(d3.easeElastic)
            .duration(2000)
            .attr("cx", function(dataPoint, i) {
                return instance.xAxis(dataPoint.x);
            })
            .attr("cy", function(dataPoint, i) {
                return instance.yAxis(dataPoint.y);
            });

        // Add the labels at (x, y)
        // dots.append("text")
        //     .attr("class", "text")
        //     .attr("x", function(dataPoint) {
        //         return instance.xAxis(dataPoint.x);
        //     })
        //     .attr("y", function(dataPoint) {
        //         return instance.yAxis(dataPoint.y);
        //     })
        //     .attr("dx", function(dataPoint, i) {
        //         return normalizedSignif[i] * 0.1 + 'em';
        //     })
        //     .attr("dy", function(dataPoint) {
        //         return ".3em";
        //     })
        //     .text(function(dataPoint, i) {
        //         return categories[i];
        //     });

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.xAxis));

        // Add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(this.yAxis));
    }
}
