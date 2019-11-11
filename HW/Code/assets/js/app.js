// Step 1: Set up our chart
//= ================================
let svgWidth = 960;
let svgHeight = 500;

let margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper
// =================================
let svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Step 3:
// Import data from the donuts.csv file
// =================================
d3.csv("data.csv").then(function(acsData) {

// Step 4: 
// Format the data
acsData.forEach(function(data) {
  data.smokes = +data.smokes;
  data.age = +data.age;
});

// Step 5: Create the scales for the chart
// =================================
let xLinearScale = d3.scaleLinear().range([0,width]);
let yLinearScale = d3.scaleLinear().range([height, 0]);

// Step 6: Create the axes
// ========================
let bottomAxis = d3.axisBottom(xLinearScale);
let leftAxis = d3.axisLeft(yLinearScale);

let xMin;
let xMax;
let yMin;
let yMax;

// Adjust xMin, xMax, yMin, yMax to have buffer (+/- 2)
xMin = d3.min(acsData, function(data) {
    return (data.age - 2);
});
xMax = d3.max(acsData, function(data) {
    return (data.age + 2);
});
yMin = d3.min(acsData, function(data) {
    return (data.smokes - 2);
});
yMax = d3.max(acsData, function(data) {
    return (data.smokes + 2);
});

xLinearScale.domain([xMin, xMax]);
yLinearScale.domain([yMin, yMax]);


// Step 7: Append the axes to the chartGroup
// ==============================================
// Add x-axis
chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

// Add y-axis
chartGroup.append("g")
  .call(leftAxis);


// Step 8: Create Circles
// ==============================
let circlesGroup = chartGroup.selectAll("circle")
.data(acsData)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d.age))
.attr("cy", d => yLinearScale(d.smokes))
.attr("r", "12")
.attr("fill", "LightPink")
.attr("opacity", .8)


// Step 9: Create axes labels
// ==============================

chartGroup.append("text")
  .style("font-size", "12px")
  .selectAll("tspan")
  .data(acsData)
  .enter()
  .append("tspan")
  .attr("x", function(data) {
      return xLinearScale(data.age - .15);
  })
  .attr("y", function(data) {
      return yLinearScale(data.smokes - .15);
  })
  .text(function(data) {
      return data.abbr
  });


  // Axes Labels (X)
  chartGroup.append("text")
  .attr("class", "x-label")
  .attr("text-anchor", "end")
  .attr("x", width - 250)
  .attr("y", height + 50)
  .text("Average Age");

  // Axes Labels (Y)
  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("text-anchor", "middle")
  .attr("dy", "1em")
  .classed("axis-text", true)
  .text("% of Population - Smoker");

});

