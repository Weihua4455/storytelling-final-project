import * as d3 from 'd3'

const margin = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 50
}

const width = 995 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

const xPositionScale = d3.scaleBand().range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 1100])
  .range([height, 0])

const colorScale = d3.scaleOrdinal().range(['#88419d', '#8c96c6'])

d3.csv(require('./data/obit_gender_by_year.csv')).then(ready)

function ready(datapoints) {
  const years = datapoints.map(d => d.year)
  xPositionScale.domain(years)

  var nested = d3
    .nest()
    .key(d => d.year)
    .rollup(values => d3.sum(values, d => d.Amount))
    .entries(datapoints)

  console.log(nested)

  var dataMan = datapoints.filter(d => d.gender === 'male')
  var dataWoman = datapoints.filter(d => d.gender === 'female')

  // Draw bars for the total

  svg
    .selectAll('.all-bars')
    .data(nested)
    .enter()
    .append('rect')
    .attr('class', 'all-bars')
    .attr('width', xPositionScale.bandwidth())
    .attr('height', d => {
      return height - yPositionScale(d.value)
    })
    .attr('x', d => {
      return xPositionScale(d.key)
    })
    .attr('y', d => {
      return yPositionScale(d.value)
    })
    .attr('fill', '#d7b5d8')

  const yAxis = d3.axisLeft(yPositionScale)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  // d3.select('.y-axis .domain').remove()

  const xAxis = d3.axisBottom(xPositionScale)

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  // Draw bars for all women
  //  svg
  //    .selectAll('.female')
  //    .data(dataWoman)
  //    .enter()
  //    .append('rect')
  //    .attr('class', 'female')
  //    .attr('width', xPositionScale.bandwidth() / 2.5)
  //    .attr('height', d => {
  //     return height - yPositionScale(d.Amount)
  //    })
  //    .attr('x', d => {
  //     return xPositionScale(d.year) + xPositionScale.bandwidth() / 2.5
  //   })
  //   .attr('y', d => {
  //      return yPositionScale(d.Amount)
  //    })
  //    .attr('fill', d => {
  //      return colorScale(d.gender)
  //    })

  //    svg
  //    .selectAll('.male')
  //    .data(dataMan)
  //    .enter()
  //    .append('rect')
  //    .attr('class', 'male')
  //    .attr('width', xPositionScale.bandwidth() / 2.5)
  //    .attr('height', d => {
  //     return height - yPositionScale(d.Amount)
  //    })
  //    .attr('x', d => {
  //      return xPositionScale(d.year)
  //    })
  //   .attr('y', d => {
  //      return yPositionScale(d.Amount)
  //    })
  //    .attr('fill', d => {
  //      return colorScale(d.gender)
  //    })

  //   // These are the steps. Be sure to change IDs in the index.html

  d3.select('#by-gender').on('stepin', () => {
    console.log('step into by gender')

    svg.selectAll('.all-bars').attr('display', 'none')
    svg.selectAll('.female').attr('display', 'inline')
    svg.selectAll('.male').attr('display', 'inline')

    svg
      .selectAll('.female')
      .data(dataWoman)
      .enter()
      .append('rect')
      .attr('class', 'female')
      .attr('width', xPositionScale.bandwidth() / 2.5)
      .attr('height', d => {
        return height - yPositionScale(d.Amount)
      })
      .attr('x', d => {
        return xPositionScale(d.year) + xPositionScale.bandwidth() / 2.5
      })
      .attr('y', d => {
        return yPositionScale(d.Amount)
      })
      .attr('fill', d => {
        return colorScale(d.gender)
      })

    svg
      .selectAll('.male')
      .data(dataMan)
      .enter()
      .append('rect')
      .attr('class', 'male')
      .attr('width', xPositionScale.bandwidth() / 2.5)
      .attr('height', d => {
        return height - yPositionScale(d.Amount)
      })
      .attr('x', d => {
        return xPositionScale(d.year)
      })
      .attr('y', d => {
        return yPositionScale(d.Amount)
      })
      .attr('fill', d => {
        return colorScale(d.gender)
      })
  })

  d3.select('#ready-chart-one').on('stepin', () => {
    console.log('step into chart one')
    svg.selectAll('.female').attr('display', 'none')
    svg.selectAll('.male').attr('display', 'none')

    svg.selectAll('.all-bars').attr('display', 'inline')
  })

  // // This is the render function
  // function render() {
  //   let screenWidth = svg.node().parentNode.parentNode.offsetWidth
  //   let screenHeight = svg.node().parentNode.parentNode.offsetHeight
  //   let newWidth = screenWidth - margin.left - margin.right
  //   let newHeight = screenHeight - margin.top - margin.bottom
  //   let actualSvg = d3.select(svg.node().parentNode)
  //   actualSvg
  //     .attr('height', newHeight + margin.top + margin.bottom)
  //     .attr('width', newWidth + margin.left + margin.right)

  //   xPositionScale.range([0, newWidth])
  //   yPositionScale.range([newHeight, 0])
  // }

  // window.addEventListener('resize', render)
  // render()
}
