// @TODO: YOUR CODE HERE!
// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {
    // console.log(`In the function`);
    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("#scatter");
    // clear svg is not empty
    if (!svgArea.empty()) {
      // svgArea.remove();
      svgArea.html()
    }
  
    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;
  
    var margin = {
      top: 50,
      bottom: 50,
      right: 50,
      left: 50
    };
  
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;
    
    // Append SVG element
    var svg = svgArea
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);
    
    // Append group element
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    console.log(`Going to read the excel`);
    // Read CSV
      d3.csv("assets/data/data.csv")
      .then(function(censusData) {
      // console.log(censusData);
        // parse data
        censusData.forEach(function(data) {
          data.poverty = +data.poverty;
          data.povertyMoe = +data.povertyMoe;
          data.age = +data.age;
          data.ageMoe = +data.ageMoe;
          data.income = +data.income;
          data.incomeMoe = +data.incomeMoe;
          data.healthcare = +data.healthcare;
          data.healthcareLow = +data.healthcareLow;
          data.healthcareHigh = +data.healthcareHigh;
          data.obesity = +data.obesity;
          data.obesityLow = +data.obesityLow;
          data.obesityHigh = +data.obesityHigh;
          data.smokes = +data.smokes; 
          data.smokesLow = +data.smokesLow;
          data.smokesHigh = +data.smokesHigh;
        });
  
        // create scales
        var xLinearScale = d3.scaleLinear()
          .domain(d3.extent(censusData, d => d.poverty))
          .range([0, width]);
  
        var yLinearScale = d3.scaleLinear()
          .domain([0, d3.max(censusData, d => d.healthcare)])
          .range([height, 0]);
  
        // create axes
        var xAxis = d3.axisBottom(xLinearScale);
        var yAxis = d3.axisLeft(yLinearScale);
  
        // append axes
        chartGroup.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(xAxis);
        
        console.log(chartGroup);
        
        chartGroup.append("g")
          .call(yAxis);
        
        console.log(chartGroup);

        // line generator
        var line = d3.line()
          .x(d => xLinearScale(d.poverty))
          .y(d => yLinearScale(d.healthcare));
  
        // append circles
        var circlesGroup = chartGroup.selectAll("circle")
          .data(censusData)
          .enter()
          .append("circle")
          .attr("class","stateCircle")
          .attr("cx", d => xLinearScale(d.poverty))
          .attr("cy", d => yLinearScale(d.healthcare))
          .attr("r", "15");
          // .attr("fill", "blue");

        circlesGroup = chartGroup.selectAll(".label")
        .data(censusData)
        .enter()
        .append("text")
        .attr("class", "label stateText")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .text(d => d.abbr);

      // Create group for  2 x- axis labels
        var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

        var pvertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .text("In poverty %");

      // append y axis
        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        // .classed("axis-text", true)
        .text("Lacks Healthcare %");

        // Step 1: Initialize Tooltip
        var toolTip = d3.tip()
          .attr("class", "d3-tip")
          .offset([80, -60])
          .html(function(d) {
            return (`<strong>${d.state}</strong></br> <strong>Poverty: ${d.poverty}%</strong></br> <strong>Obesity: ${d.obesity}%</strong>`);
          });
  
        // Step 2: Create the tooltip in chartGroup.
        chartGroup.call(toolTip);
  
        // Step 3: Create "mouseover" event listener to display tooltip
        circlesGroup.on("mouseover", function(d) {
          toolTip.show(d, this);
        })
        // Step 4: Create "mouseout" event listener to hide tooltip
          .on("mouseout", function(d) {
            toolTip.hide(d);
          });
      });
  }
  
  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);  