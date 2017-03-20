require('core-js');

export class ScatterPlotDataPoint {

    /**
     * @param x - the x-coordinate
     * @param y - the y-coordinate
     */
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    get x() {
        return this._x;
    }

    set x(x) {
        this._x = x;
    }

    get y() {
        return this._y;
    }

    set y(y) {
        this._y = y;
    }
}
