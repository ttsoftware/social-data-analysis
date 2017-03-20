var svgContainer = d3.select("#svgContainer").append("svg")
    .attr("width", 300)
    .attr("height", 300);

var colors = ['red', 'blue', 'green', 'yellow', 'cyan'];
var rectangles = [];

for (var i = 0; i < 5; i++) {

    var opacity = Math.abs((i * 0.1) - 1);
    var offset = (i * 25);
    var rectangle = svgContainer.append("rect")
        .attr("x", offset + 10)
        .attr("y", 200 - offset)
        .attr("height", 80)
        .attr("width", 80)
        .attr("stroke-opacity", 1)
        .attr("stroke", "grey")
        .attr("fill-opacity", opacity)
        .attr("fill", colors[i]);

    rectangles.push(rectangle);
}
