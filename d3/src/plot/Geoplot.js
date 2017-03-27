require('core-js');

import * as d3 from 'd3';
import {
    Plot
} from './Plot.js';

export class Geoplot extends Plot {

    /**
     * @param dataPoints
     */
    constructor(height, width, mapData, dataPoints = [], clusterCenters = []) {
        super(height, width, null, null);

        this.mapData = mapData;
        this.dataPoints = dataPoints;
        this.clusterCenters = clusterCenters;
    }

    /**
     * Add the geoplot
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

        //Define default path generator
        let projection = d3.geoMercator()
            .center([-122.433701, 37.767683])
            .translate([this.width / 2, this.height / 2])
            .scale([250000]);

        let path = d3.geoPath()
            .projection(projection);

        // draw map
        svg.selectAll("path")
            .data(this.mapData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", "steelblue");

        // draw all data points
        svg.selectAll("circle")
            .data(this.dataPoints)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                return projection([d.LON, d.LAT])[0];
            })
            .attr("cy", function(d) {
                return projection([d.LON, d.LAT])[1];
            })
            .attr("r", 2)
            .style("fill", function(d, i) {
                return colors[d.CLUSTER];
            });

        // draw clust centers
        this.clusterCenters.forEach(function(clusterCenter, i) {

            svg.append("circle")
                .attr("cx", function(d) {
                    return projection([clusterCenter[0], clusterCenter[1]])[0];
                })
                .attr("cy", function(d) {
                    return projection([clusterCenter[0], clusterCenter[1]])[1];
                })
                .attr("r", 10)
                .style("fill", function(d) {
                    return colors[i];
                })
                .attr("stroke", "black")
                .attr("stroke-width", 3);
        });
    }
}
