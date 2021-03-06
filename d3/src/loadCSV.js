require('core-js');

import * as d3 from 'd3';
import {
    ScatterPlotDataPoint
} from './plot/ScatterPlotDataPoint.js';

export function loadCSV(csvs) {

    let csvPromises = [];

    // iterate through csv files
    csvs.forEach(function(csv) {

        let csvPromise = new Promise(function(resolve, reject) {

            d3.csv(csv, function(error, data) {
                if (error) {
                    reject(error)
                }
                else {
                    // format the data
                    let dataPoints = data.map(function(d) {
                        return new ScatterPlotDataPoint(
                            +d['PROSTITUTION'],
                            +d['VEHICLE THEFT'],
                            +d['TOTAL'],
                            d['CATEGORIES']
                        );
                    });

                    // sort by total descending
                    dataPoints = dataPoints.sort(function (a, b) {
                        return a.ySignificance - b.ySignificance;
                    }).reverse();

                    resolve(dataPoints);
                }
            });
        });

        csvPromises.push(csvPromise);
    });

    return csvPromises;
}
