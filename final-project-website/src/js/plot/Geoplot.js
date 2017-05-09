require('core-js');

import * as d3 from 'd3';
import {
    Plot
} from './Plot.js';

export class Geoplot extends Plot {

    /**
     * @param dataPoints
     */
    constructor(height, width, mapData, dataPoints = []) {
        super(height, width, null, null);

        this.mapData = mapData;
        this.dataPoints = dataPoints;
    }

    /**
     * Add the geoplot
     * @param svg - the DOM svg element
     * @param colors - optional color input
     * @param opacity - optional opacity input
     */
    plot(svg, colors, opacities) {

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

        if (!opacities) {
            opacities = new Array(colors.length)
                .fill(0)
                .map(() => 0.8);
        }

        //Define default path generator
        let projection = d3.geoMercator()
            .center([-73.94, 40.70])
            .translate([this.width / 2, this.height / 2])
            .scale([70000]);

        let path = d3.geoPath()
            .projection(projection);

        // draw map
        svg.selectAll("path")
            .data(this.mapData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", "black");

        // Append the tooltip div
        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "text")
            .style("opacity", 0);

        // mouseover tooltips
        let dots = svg.selectAll("g.dot")
            .data(this.dataPoints)
            .enter()
            .append("g")
            .on("mousemove", function(dataPoint, i) {
                tooltip.style("opacity", 1);
                tooltip.html(
                        dataPoint.INTERSECTION + '<br>' +
                        '<span style="color: #161515">Accidents</span>: ' + dataPoint.ACCIDENTS + '<br>' +
                        '<span style="color: #161515">Injuries</span>: ' + dataPoint.INJURIES + '<br>'
                    )
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 10) + "px")
                    .style("background-color", '#C02F1D');
            })
            .on("mouseout", function(dataPoint) {
                tooltip.style("opacity", 0);
            });

        // draw all data points
        dots.append("circle")
            .attr("cx", function(d) {
                return projection([d.LON, d.LAT])[0];
            })
            .attr("cy", function(d) {
                return projection([d.LON, d.LAT])[1];
            })
            .attr("r", function(d) {
                return d.ACCIDENTS / 70;
            })
            .style("fill", function(d, i) {
                return colors[d.COLOR];
            })
            .style("opacity", function(d) {
                return opacities[d.COLOR];
            });
    }
}
