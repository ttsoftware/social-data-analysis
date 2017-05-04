require('core-js');

export class ScatterPlotDataPoint {

    /**
     * @param x - the x-coordinate
     * @param y - the y-coordinate
     * @param ySignificance - the significance of the y-value
     * @param category - the category of the data point
     */
    constructor(x, y, ySignificance, category) {
        this._x = x;
        this._y = y;
        this._ySignificance = ySignificance;
        this._category = category;
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

    get ySignificance() { return this._ySignificance; }
    set ySignificance(ySignificance) { this._ySignificance = ySignificance; }

    get category() { return this._category; }
    set category(category) { this._category = category; }
}
