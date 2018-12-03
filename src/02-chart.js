import * as d3 from 'd3'

const margin = {
  top: 30,
  right: 50,
  bottom: 50,
  left: 100
}

const width = 995 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

// Add the container the SVG and canvas will live in
let container = d3.select('#chart-2').append('div')
// .style('position', 'relative')

// Add the canvas
let canvas = container
  .append('canvas')
  .style('z-index', 10)
  .style('position', 'absolute')
  .style('top', 0)
  .style('left', 0)
  .attr('height', height + margin.left + margin.right)
  .attr('width', width + margin.left + margin.right)

var context = canvas.node().getContext('2d')
context.translate(margin.left, margin.top)

let svg = container
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var xPositionScale = d3.scaleLinear().range([0, width])
var yPositionScale = d3.scaleLinear().range([height, 0])
const colorScale = d3.scaleOrdinal().range(['pink', 'green']).domain(['male', 'female'])

// Not doing anything, but it's nice to always keep a context
d3.csv(require('./data/obit_data_for_graph.csv')).then(ready)

function ready(datapoints) {
  var maxPage = d3.max(datapoints, d => +d.print_page)
  var maxWordCount = d3.max(datapoints, d => +d.word_count)

  // console.log(maxPage)
  // console.log(maxWordCount)

  xPositionScale.domain([maxPage, 0])
  yPositionScale.domain([0, maxWordCount])

  // Adding a new column for x, y, radius and color
  datapoints.forEach(d => {
    d.x = xPositionScale(d.print_page)
    d.y = yPositionScale(d.word_count)
    d.r = 3
    d.color = colorScale(d.gender)
  })

  context.globalAlpha = 0.4
  // Draw using those columns
  datapoints.forEach(d => {
    context.beginPath()
    context.arc(d.x, d.y, d.r, 0, Math.PI * 2)
    context.closePath()
    context.fillStyle = d.color
    context.fill()
  })

  context.clearRect(0, height, width, height + 100)
  var yAxis = d3.axisLeft(yPositionScale).tickSize(-width)
  // .tickValues([0, 50000000, 1000000000, 200000000, 300000000])
  // .tickFormat(d3.format('$,.0s'))

  svg
    .append('text')
    .attr('text-anchor', 'middle')
    .text('Word')
    .attr('font-size', 15)
    .attr('font-weight', 700)
    .attr('alignment-baseline', 'middle')
    .attr('x', xPositionScale(maxPage + 5))
    .attr('y', yPositionScale(maxWordCount / 2))

  svg
    .append('text')
    .attr('text-anchor', 'middle')
    .text('Count')
    .attr('font-size', 15)
    .attr('font-weight', 700)
    .attr('alignment-baseline', 'middle')
    .attr('x', xPositionScale(maxPage + 5))
    .attr('y', yPositionScale(maxWordCount / 2))
    .attr('dy', 20)

  svg
    .append('text')
    .attr('text-anchor', 'middle')
    .text('Not Printed')
    .attr('font-size', 15)
    .attr('font-weight', 700)
    .attr('alignment-baseline', 'middle')
    .attr('x', xPositionScale(0))
    .attr('y', yPositionScale(0))
    .attr('dy', 30)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  var xAxis = d3.axisBottom(xPositionScale)

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .lower()
}
