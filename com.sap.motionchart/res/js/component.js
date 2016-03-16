define(["d3","sap/designstudio/sdk/component", "css!../css/component.css"], function(d3,Component, css) {
	Component.subclass("com.sap.motionchart.MotionChart", function() {
	
	//Graph Data Storage Variables
	var _xdata = null,
		_ydata = null,
		_rdata = null,
		meta_data = null;
	
	//X-Axis Getter/Setter
	this.xdata = function(value) {
		if(value === undefined) {
			return _xdata;
		} else {
			_xdata = value;
			return this;	
		}
	};
	
	//Y-Axis Getter/Setter
	this.ydata = function(value) {
		if(value === undefined) {
			return _ydata;
		} else {
			_ydata = value;
			return this;
		}
	};
	
	//R-Data Getter/Setter
	this.rdata = function(value) {
		if(value === undefined) {
			return _rdata;
		} else {
			_rdata = value;
			return this;
		}
	};
	
	//Metadata Getter/Setter
	this.metadata = function(value) {
		if(value === undefined) {
			return meta_data;
		} else {
			meta_data = value;
			return this;
		}
	};
	
	//Initialize the component
	this.init = function() {
		this.$().addClass("land");
		
		//Get width and height of canvas
		var w = this.$().width(),
			h = this.$().height();
		
		//Creating DIV element to put in canvas
		this.paddingDiv = document.createElement("DIV");	
		$(this.paddingDiv).appendTo(this.$());
		
		//SVG to render chart
		var sv = d3.select(this.paddingDiv)
		.append("svg")
		.attr("width", w)
		.attr("height", h)
		.attr("viewBox", "0 0 1500 1000")
		.attr("preserveAspectRatio", "none")
		.append("g");
		
		sv.append("rect")
		.attr("x", "500")
		.attr("y", "350")
		.attr("width", "500")
		.attr("height", "300")
		.style({"fill": "white",
				"stroke": "#dedede",
				"fill-opacity": 0.9});
	
		sv.append("text")
		.attr("x", "600")
		.attr("y", "513")
		.text("Assign a data source")
		.attr("font-size", "35px");
	};
		
	
	this.afterUpdate = function() {
		
		//Checks if data is retrieved
		if(_xdata && _ydata && _rdata) {
			
			this.$().removeClass("land");
			this.$().addClass("chart");
			
			var padding = 70,
				paddingy = 40;
			
			var xRange = _xdata.data,
				yRange = _ydata.data,
				rRange = _rdata.data;
			
			var headerText1 = "",
				headerText2 = "",
				bubbleText = "";
			
			//Defining functions to retrieve data
			function x(d) { return d.xaxisdata; }
			function y(d) { return d.yaxisdata; }
			function radius(d) { return d.radiusdata; }
			function color(d) { return d.name; }
			function key(d) { return d.name; }
			
			//Width and Height of the Chart
			var w = ((this.$().width()) - (this.$().width()/4)),
				h = this.$().height();
			
			//Various Scale functions
			var xScale = d3.scale.linear().domain([0, d3.max(xRange) + d3.max(xRange)/4]).range([padding, w - paddingy]),
				yScale = d3.scale.linear().domain([0, d3.max(yRange) + d3.max(yRange)/ 4]).range([h - padding, padding]),
				rScale = d3.scale.sqrt().domain([0, d3.max(rRange)]).range([0, 20]);
				colorScale = d3.scale.category10();
				
			//Determine X-Axis Label
			for(var i = 0; i < _xdata.selection.length; i++) {
				var selectionIndex = _xdata.selection[i];
				if(selectionIndex != -1) {
					headerText1 += " " + meta_data.dimensions[i].members[selectionIndex].text;
				}
			}

			//Determine Y-Axis Label
			for(var i = 0; i < _ydata.selection.length; i++) {
				var selectionIndex = _ydata.selection[i];
				if(selectionIndex != -1) {
					headerText2 += " " + meta_data.dimensions[i].members[selectionIndex].text;
				}
			}
			
			//Determine the dimensions
			var column_data = getAnySetColumn_Data(),
				headerText = "",
				dim1 = "",
				dim2 = "";
			
			for(var i = 0; i < column_data.formattedData.length; i++) {
				var column_data = getAnySetColumn_Data();
				if(meta_data && column_data && column_data.formattedData && (i < column_data.tuples.length)) {
					var tuple = column_data.tuples[i];
					
					for(var j = 0; j < tuple.length; j++) {
						if(column_data.selection[j] == -1) {
							headerText += meta_data.dimensions[j].members[tuple[j]].text + ",";
						}
					}
				//	headerText = headerText.replace("|", " "); //Delimiter used for multiple presentations
				}
			}
		
			headerText = headerText.slice(0, headerText.length-1);
			var dim = headerText.split(",");
			for(var i = 0; i < dim.length; i++) {
				if(i % 2 == 0) {
					dim1 += dim[i] + ",";
				} else {
					dim2 += dim[i] + ",";
				}
			}
			
			dim1 = dim1.slice(0, dim1.length-1); 
			dim2 = dim2.slice(0, dim2.length-1);
			
			var dimension1 = dim1.split(","),
				dimension2 = dim2.split(",");
			
			function getAnySetColumn_Data() {
				if(_xdata && _xdata.formattedData) {
					return _xdata;
				} else if(_ydata && _ydata.formattedData) {
					return _ydata;
				} else if(_rdata && _rdata.formattedData) {
					return _rdata;
				}
				return null;
			}
			
			this.$().empty();
			
			//Creating DIV to append SVG
			this.paddingDiv = document.createElement("DIV");
			$(this.paddingDiv).appendTo(this.$());
			
			//Create SVG container and append to Div
			var svg = d3.select(this.paddingDiv)
						.append("svg")
						.attr("width", w)
						.attr("height", h)
						.attr("class", "div1")
						.append("g")
						.attr("transform", "translate(" + 30 + "," + 0 + ")");
			
			//SVG to hold legends of chart
			var svg2 = d3.select(this.paddingDiv)
						.append("svg")
						.attr("width", this.$().width())
						.attr("height", this.$().height())
						.attr("class", "div2")
						.append("g")
						.attr("transform", "translate(" + 0 + "," + 0 + ")");
			
			//Define X and Y Axis
			var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(5);
			
			var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(5); //tickSize(-(w - (2*padding)), 0)
			
		
			// create X axis
			svg.append("g").attr("transform", "translate(0," + (h - padding) + ")").style("shape-rendering",
				"crispEdges").style("fill", "none").style("stroke", "black").call(xAxis);

			// Create Y axis
			svg.append("g").attr("transform", "translate(" + padding + ",0)").style("shape-rendering", "crispEdges")
				.style("fill", "none").style("stroke", "black").call(yAxis);
		
			
			//Add X Axis Label
			svg.append("text")
				.attr("class", "x label")
				.attr("text-anchor", "end")
				.style("font-size", "10px")
				.attr("x", w - 40)
				.attr("y", h - 30)
				.text(headerText1);
			
			//Add Y Axis Label
			svg.append("text")
				.attr("class", "y label")
				.attr("text-anchor", "end")
				.style("font-size", "10px")
				.attr("y", -5)
				.attr("x", -70)
				.attr("dy", ".75em")
				.attr("transform", "rotate(-90)")
				.text(headerText2);
			
			//Add the year label; the value is set on transition
			var label = svg.append("text")
						.attr("class", "year label")
						.attr("text-anchor", "end")
						.attr("y", h - 80)
						.attr("x", w - 40)
						.text(parseInt(n));
			
			var dataset = [];
			
			for(var i = 0; i < xRange.length; i++) {
				var datax = xRange[i];
				var datay = yRange[i];
				var datar = rRange[i];
				var data1 = dimension1[i];
				var data2 = dimension2[i];
				dataset.push({ d1 : data1, d2 : data2, x : datax, y : datay, r : datar});
			}
			
			//Manipulation on the json data to sort and arrange in the required order
			var sort_by;

			(function() {
				// utility functions
				var default_cmp = function(a, b) {
					if (a == b)
						return 0;
					return a < b ? -1 : 1;
				}, getCmpFunc = function(primer, reverse) {
					var dfc = default_cmp, // closer in scope
					cmp = default_cmp;
					if (primer) {
						cmp = function(a, b) {
							return dfc(primer(a), primer(b));
						};
					}
					if (reverse) {
						return function(a, b) {
							return -1 * cmp(a, b);
						};
					}
					return cmp;
				};

				// actual implementation
				sort_by = function() {
					var fields = [], n_fields = arguments.length, field, name, reverse, cmp;

					// preprocess sorting options
					for (var i = 0; i < n_fields; i++) {
						field = arguments[i];
						if (typeof field === 'string') {
							name = field;
							cmp = default_cmp;
						} else {
							name = field.name;
							cmp = getCmpFunc(field.primer,
									field.reverse);
						}
						fields.push({
							name : name,
							cmp : cmp
						});
					}

					// final comparison function
					return function(A, B) {
						var a, b, name, result;
						for (var i = 0; i < n_fields; i++) {
							result = 0;
							field = fields[i];
							name = field.name;

							result = field
									.cmp(A[name], B[name]);
							if (result !== 0)
								break;
						}
						return result;
					}
				}
			}());
			
			
			var dt = dataset.sort(sort_by('d2', {
				name : 'd1',
				primer : parseInt,
				reverse : false
			}));
			
			var cou = [];
			for(var i = 0; i < dt.length; i++)
				{
					cou[i] = dt[i].d2;
				}
			
			
			function foo(arr) {
			    var a = [], b = [], prev;

			    arr.sort();
			    for ( var i = 0; i < arr.length; i++ ) {
			        if ( arr[i] !== prev ) {
			            a.push(arr[i]);
			            b.push(1);
			        } else {
			            b[b.length-1]++;
			        }
			        prev = arr[i];
			    }

			    return [a, b];
			}
			
			var result = foo(cou);	

			var jsonData = [];
			var data_x = [],
				data_y = [],
				data_r = [],
				data_a = [];
			
			var k = 0,
				initialValue = 0,
				finalValue = 0;
			
			for(var i = 0; i < result[1].length; i++) {
				initialValue = k;
				finalValue = initialValue + result[1][i];
				for(var j = initialValue; j < finalValue; j++) {
					data_x.push([parseInt(dt[j].d1), parseFloat(dt[j].x)]);
					data_y.push([parseInt(dt[j].d1), parseFloat(dt[j].y)]);
					data_r.push([parseInt(dt[j].d1), parseFloat(dt[j].r)]);
					data_a.push([parseInt(dt[j].d1)]);
				}
	
				jsonData.push({name : dt[initialValue].d2, region : data_a, xaxisdata: data_x, radiusdata: data_r, yaxisdata: data_y});
				k = finalValue;
				data_x = [];
				data_y = [];
				data_r = [];
			}
			
			var jk = jsonData[0].region;
			
			jk.sort(function(a, b) {
				return a - b;
			});
			
			var n = parseInt(jsonData[0].region[0][0]);
			var m = parseInt(jsonData[0].region[jsonData[0].region.length - 1][0]);
			
			//Legend Display Code

			  var hello = [];
			  
			  for(var i = 0; i < jsonData.length; i++)
				  {
				  	hello[i] = jsonData[i].name;
				  }
			  
			  var legend = svg2.append('g')
			  	.attr("class", "legend");
			  
			  legend.selectAll("text")
			  .data(hello)
			  .enter()
			  .append("text")
			       .attr('x', this.$().width() - 80)
			       .style("font-size", "9px")
		      .attr('y', function(d, i){ return (i *  20) + 9;})
			  	.text(function(d){ return d; });
			  
			
		  legend.selectAll('rect')
		  .data(hello)
		  .enter()
		  .append("rect")
		      .attr('x', this.$().width() - 105)
		      .attr('y', function(d, i){ return i *  20;})
		      .attr('width', 8)
		      .attr('height', 8)
		     .style("fill", function(d) { return colorScale(d); });
		
		  // Source: https://github.com/RandomEtc/mind-gapper-js
		  //		 http://www.gapminder.org/
			
			  // A bisector since many dimension's data is sparsely-defined.
			  var bisect = d3.bisector(function(d) { return d[0]; });

			  // Add a dot per dimension. 
			  var dot = svg.append("g")
			      .attr("class", "dots")
			    .selectAll(".dot")
			      .data(interpolateData(n))
			    .enter().append("circle")
			      .attr("class", "dot")
			      .style("fill", function(d) { return colorScale(color(d)); })
			      .call(position)
			      .sort(order);
		
			  repeat();
			  // Add a title.
			  dot.append("title")
			      .text(function(d) { return d.name; });

			  // Add an overlay for the year label.
			  var box = label.node().getBBox();

			  var overlay = svg.append("rect")
			        .attr("class", "overlay")
			        .attr("x", box.x)
			        .attr("y", box.y)
			        .attr("width", box.width)
			        .attr("height", box.height)
			        .on("mouseover", enableInteraction);

			  var timer;
			  function repeat(){
			  // Start a transition that interpolates the data based on year.
			  svg.transition()
			      .duration(50000)
			      .ease("linear")
			      .tween("year", tweenYear)
			      .each("end", enableInteraction);

			  timer = setTimeout(repeat, 51000);
			  
			  }

			  
			  // Positions the dots based on data.
			  function position(dot) {
			    dot .attr("cx", function(d) { return xScale(x(d)); })
			        .attr("cy", function(d) { return yScale(y(d)); })
			        .attr("r", function(d) { return rScale(radius(d)); });
			  }

			  // Defines a sort order so that the smallest dots are drawn on top.
			  function order(a, b) {
			    return radius(b) - radius(a);
			  }

			  // After the transition finishes, you can mouseover to change the year.
			  function enableInteraction() {
			    var yearScale = d3.scale.linear()
			        .domain([n, m])
			        .range([box.x + 10, box.x + box.width - 10])
			        .clamp(true);

			    // Cancel the current transition, if any.
			  
			    overlay
		        .on("mouseover", mouseover)
		        .on("mouseout", mouseout)
		        .on("mousemove", mousemove)
		        .on("touchmove", mousemove);

			    function mouseover() {
			    	  clearTimeout(timer);
					    svg.transition().duration(0);
  
			      label.classed("active", true);
			    }

			    function mouseout() {
			      label.classed("active", false);
			    }

			    function mousemove() {
			      displayYear(yearScale.invert(d3.mouse(this)[0]));
			    }
			  }

			  // Tweens the entire chart by first tweening the year, and then the data.
			  // For the interpolated data, the dots and label are redrawn.
			  function tweenYear() {
			    var year = d3.interpolateNumber(n, m);
			    return function(t) { displayYear(year(t)); };
			  }

			  // Updates the display to show the specified year.
			  function displayYear(year) {
			    dot.data(interpolateData(year), key).call(position).sort(order);
			    label.text(Math.round(year));
			  }

			  // Interpolates the dataset for the given (fractional) year.
			  function interpolateData(year) {
			    return jsonData.map(function(d) {
			      return {
			        name: d.name,
			        region: d.region,
			        xaxisdata: interpolateValues(d.xaxisdata, year),
			        radiusdata: interpolateValues(d.radiusdata, year),
			        yaxisdata: interpolateValues(d.yaxisdata, year)
			      };
			    });
			  }

			  // Finds (and possibly interpolates) the value for the specified year.
			  function interpolateValues(values, year) {
			    var i = bisect.left(values, year, 0, values.length - 1),
			        a = values[i];
			    if (i > 0) {
			      var b = values[i - 1],
			          t = (year - a[0]) / (b[0] - a[0]);
			      return a[1] * (1 - t) + b[1] * t;
			    }
			    return a[1];
			  }
		} 
	};
	});
});