import * as d3 from 'd3';

const SERIES_TYPES = ["LINE", "AREA"];
const TRANSITION_DURATION = 20;

export default class D3TsChart {

  // HTML Element References
  elRef = null;
  svg; // Main SVG container
  group;

  // Layout config
  margin = { top: 10, right: 30, bottom: 30, left: 30 };

  outerWidth; outerHeight;
  responsiveHeight = false;
  responsiveWidth = false;  // responsive flags will be only true if you don't set width or height


  // Axes
  xScale = d3.scaleTime();
  xAxisRef;
  yAxisRef;
  yScale = d3.scaleLinear();

  // Series
  seriesDict = {
    // "seriesname": { type: SERIES_TYPES, ref: d3 object}
  };

  //Other config
  forceZeroOnYaxis = true;

  constructor ({ elRef, width, height, classList }) {
    this.elRef = elRef;

    //config  -- could make margins configurable too but I thought it's too much
    this.outerWidth = width || this.elRef.offsetWidth;
    this.outerHeight = height || this.elRef.offsetHeight;

    this.classList = classList || {};

    if (width === undefined) this.responsiveWidth = true;
    if (height === undefined) this.responsiveHeight = true;

    this.draw();
  }

  draw() {
    // Main SVG
    this.svg = d3.select(this.elRef)
      .append("svg")
      .attr("width", this.outerWidth)
      .attr("height", this.outerHeight)
      .classed(this.classList.svg, true);

    //Inner box group  (deducting margins)
    this.group = this.svg.append("g")
      .attr("width", this.outerWidth - this.margin.left - this.margin.right)
      .attr("height", this.outerHeight - this.margin.top - this.margin.bottom)
      .attr("transform", `translate(${this.margin.left} , ${this.margin.top})`);

    // X Axis
    this.xScale
      .range([0, this.outerWidth - this.margin.left - this.margin.right])
    this.xAxisRef = this.group.append("g")
      .attr("transform", `translate(0,${this.outerHeight - this.margin.bottom})`)
      .classed("x-axis", true);

    // Y Axis
    this.yScale
      .range([this.outerHeight - this.margin.bottom, 0]);
    this.yAxisRef = this.group.append("g")
      .attr("transform", `translate(0, 0)`)
      .classed("y-axis", true)
  }

  addSeries({ name, type, fill, stroke, strokeWidth, id }) {
    if (!SERIES_TYPES.includes(type)) throw new Error("Series type not supported");

    this.seriesDict[name] = {
      type,
      ref: this.group.append("path")
        .attr("id", id)
        .attr("fill", fill || "none")
        .attr("stroke", stroke || "black")
        .attr("stroke-width", strokeWidth || 2)
        .classed("series", true)
    }
  }

  updateSeries(name, data, adjustAxes = true) {
    const series = this.seriesDict[name];

    this.adjustDimensions();

    if (adjustAxes) this.adjustAxes(data);

    switch (series.type) {
      case "AREA":
        this.updateArea(series, data)
        break;
      case "LINE":
      default:
        this.updateLine(series, data)
        break;
    }
  }

  updateLine(series, data) {
    series.ref
      .datum(data)
      .transition().duration(TRANSITION_DURATION).ease(d3.easeQuadIn)
      .attr("d", d3.line()
        .x((d) => { return this.xScale(d.timestamp) })
        .y((d) => { return this.yScale(d.value) })
      )
  }


  updateArea(series, data) {
    console.log(data)
    series.ref
      .datum(data)
      .transition().duration(TRANSITION_DURATION).ease(d3.easeQuadIn)
      .attr("d", d3.area()
        .x((d) => { return this.xScale(d.timestamp) })
        .y0(this.yScale(0))
        .y1((d) => {
          return this.yScale(d.value)
        })
      );
  }


  adjustAxes(data) {
    this.xScale.domain(d3.extent(data, (d) => d.timestamp));
    this.xAxisRef
      .transition().duration(TRANSITION_DURATION).ease(d3.easeLinear)
      .call(d3.axisBottom(this.xScale));

    this.yScale.domain([0, d3.max(data, (d) => d.value)]);
    this.yAxisRef
      .transition().duration(TRANSITION_DURATION).ease(d3.easeLinear)
      .call(d3.axisLeft(this.yScale));
  }

  // Helper functions
  adjustDimensions() {
    if (this.responsiveHeight) {
      this.outerHeight = this.elRef.offsetHeight;
      this.svg.transition().duration(TRANSITION_DURATION).ease(d3.easeLinear)
        .attr("height", this.outerHeight);
      this.group.transition().duration(TRANSITION_DURATION).ease(d3.easeLinear)
        .attr("height", this.outerHeight - this.margin.top - this.margin.bottom);
      this.yScale
        .range([this.outerHeight - this.margin.bottom, 0]);
    }
    if (this.responsiveWidth) {
      this.outerWidth = this.elRef.offsetWidth;
      this.svg.transition().duration(TRANSITION_DURATION).ease(d3.easeLinear)
        .attr("width", this.outerWidth);
      this.group.transition().duration(TRANSITION_DURATION).ease(d3.easeLinear)
        .attr("width", this.outerWidth - this.margin.left - this.margin.right);
      this.xScale
        .range([0, this.outerWidth - this.margin.left - this.margin.right]);
    }
  }

}