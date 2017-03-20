require('core-js');

import * as d3 from 'd3';

export class Plot {

    /**
     * @param height - height of the plot
     * @param width - width of the plot
     */
    constructor(height, width, xAxis, yAxis) {
        // plot size
        this._height = height;
        this._width = width;

        // The axis ranges
        this.xAxis = xAxis.range([0, width]);
        this.yAxis = yAxis.range([height, 0]);
    }

    /**
     * Must be implemented by child class
     *
     * @param svg - the DOM svg element
     */
    plot(svg) {
        throw new Error('Not yet implemented');
    }

    get height() {
        return this._height;
    }

    set height(height) {
        this._height = height;
    }

    get width() {
        return this._width;
    }

    set width(width) {
        this._width = width;
    }

    get xAxis() {
        return this._xAxis;
    }

    set xAxis(xAxis) {
        this._xAxis = xAxis;
    }

    get yAxis() {
        return this._yAxis;
    }

    set yAxis(yAxis) {
        this._yAxis = yAxis;
    }
}
