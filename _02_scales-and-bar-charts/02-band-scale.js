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
    }
]


const svg = d3.select('svg');

// Creating band scale
const x = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, 500])
    .paddingInner(0.1)
    .paddingOuter(0.1)

// Creating linear scale
const y = d3.scaleLinear()
    .domain([0, 1000])
    .range([0, 500])


const rects = svg.selectAll('rect').data(data)

rects
    .attr('width', x.bandwidth)
    .attr('height', d => y(d.value))
    .attr('fill', 'orange')
    .attr('x', d => x(d.name))

// Append enter selections
rects
    .enter()
    .append('rect')
    .attr('width', x.bandwidth)
    .attr('height', d => y(d.value))
    .attr('fill', 'orange')
    .attr('x', d => x(d.name))