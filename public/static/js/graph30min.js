
//var jsondata;
// console.log("getting the data");
//function doSomethingWithData() {
// console.log("get the data");
//}
//
//d3.json("/data30min/", function(dataFromServer) {
// jsondata = dataFromServer;
// doSomethingWithData();
// document.write(10);
// document.write(jsondata);
// document.write(30);
//});


// Set the dimensions of the svg
var margin = {top: 30, right: 50, bottom: 30, left: 50};
var svgWidth = 1200;
var svgHeight = 270;
var graphWidth = svgWidth - margin.left - margin.right;
var graphHeight = svgHeight - margin.top - margin.bottom;
// Parse the date / time
var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
// Set the ranges
var x = d3.scaleTime().range([0, graphWidth]);
var y = d3.scaleLinear().range([graphHeight, 0]);
// Define the axes
var xAxis = d3.axisBottom()
.scale(x);
var yAxis = d3.axisLeft()
    .scale(y);
// Define the line
var NLine = d3.line()
    .x(function(d) { return x(d.timereceived); })
    .y(function(d) { return y(d.nitrate_c); });
var CLine = d3.line()
    .x(function(d) { return x(d.timereceived); })
    .y(function(d) { return y(d.calcium_c); });
var PLine = d3.line()
    .x(function(d) { return x(d.timereceived); })
    .y(function(d) { return y(d.potassium_c); });

// Adds the svg canvas
  var svg = d3.select("#graph30")
    .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
    .append("g")
      .attr("transform", 
      "translate(" + margin.left + "," + margin.top + ")");
      

var jsondata;
 console.log("getting the data");
function doSomethingWithData(data) {
 console.log(data);
}

d3.json("/data30min/", function(dataFromServer) {
 jsondata = dataFromServer;
 doSomethingWithData(jsondata);

});


d3.queue()
     .defer(d3.json,"/data30min/")
     .await(makeGraphs);
     

    
    
    
function makeGraphs(error,jdata) {
  var data=jdata;
  data.forEach(function(d) {
  d.timereceived = parseDate(d.timereceived);
  d.nitrate_c = +d.nitrate_c;
  d.calcium_c = +d.calcium_c;
  d.potassium_c = +d.potassium_c;
  });
  console.log(data)
  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.timereceived; }));
  y.domain([d3.min(data, function(d) {
      return Math.min(d.nitrate_c, d.calcium_c, d.potassium_c) }),
      d3.max(data, function(d) {
      return Math.max(d.nitrate_c, d.calcium_c, d.potassium_c) })]);
  // Add the 2 valueline paths.
  svg.append("path")
    .style("stroke", "green")
    .style("fill", "none")
    .attr("class", "line")
    .attr("d", NLine(data));
  svg.append("path")
    .style("stroke", "blue")
    .style("fill", "none")
    .attr("d", CLine(data));
  svg.append("path")
    .style("stroke", "red")
    .style("fill", "none")
    .attr("d", PLine(data));
  // Add the X Axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + graphHeight + ")")
      .call(xAxis);
  // Add the Y Axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);
  svg.append("text")
    .attr("transform", "translate("+(graphWidth-10)+","+(graphHeight-100)+")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "green")
    .text("nitriate");
  svg.append("text")
    .attr("transform", "translate("+(graphWidth-10)+","+(graphHeight-125)+")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "blue")
    .text("calcium");
  svg.append("text")
    .attr("transform", "translate("+(graphWidth-10)+","+(graphHeight-150)+")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "red")
    .text("potassium");    
  
};


