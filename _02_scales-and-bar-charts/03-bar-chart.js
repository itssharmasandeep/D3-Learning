const data = [
    {
        name: 'name1',
        value: 200
    },
    {
        name: 'name2',
        value: 800
    },
    {
        name: 'name3',
        value: 550
    },
    {
        name: 'name4',
        value: 1100
    },
    {
        name: 'name5',
        value: 600
    },
    {
        name: 'name6',
        value: 1500
    }
]


const svg = d3.select('.canvas').append('svg').attr('width', 600).attr('height', 600);

const margins = {
    top: 20,
    right: 20,
    bottom: 100,
    left: 100
}

const gWidth = 600 - margins.left - margins.right
const gHeight = 600 - margins.top - margins.bottom

const graph = svg.append('g').attr('width', gWidth).attr('height', gHeight).attr('transform', `translate(${margins.left}, ${margins.top})`)

const xAxisGroup = graph.append('g').attr('transform', `translate(0, ${gHeight})`)
const yAxisGroup = graph.append('g')

// Creating band scale
const x = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, gWidth])
    .paddingInner(0.2)
    .paddingOuter(0.2)

// Creating linear scale
const y = d3.scaleLinear()
    .domain([0, d3.max(data, d=> d.value)])
    .range([gHeight, 0])


const rects = graph.selectAll('rect').data(data)

rects
    .attr('width', x.bandwidth)
    .attr('height', d => gHeight - y(d.value))
    .attr('fill', 'orange')
    .attr('x', d => x(d.name))
    .attr('y', d => y(d.value))

// Append enter selections
rects
    .enter()
    .append('rect')
    .attr('width', x.bandwidth)
    .attr('height', d => gHeight - y(d.value))
    .attr('fill', 'orange')
    .attr('x', d => x(d.name))
    .attr('y', d => y(d.value))

// Create axes

const xAxis = d3.axisBottom(x)
const yAxis = d3.axisLeft(y).ticks(3).tickFormat(d => d+'%')

xAxisGroup.call(xAxis)
yAxisGroup.call(yAxis)

xAxisGroup.selectAll('text').attr('transform', 'rotate(-40)').attr('text-anchor', 'end')