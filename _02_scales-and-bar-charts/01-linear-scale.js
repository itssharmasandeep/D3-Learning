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

// Creating linear scale
const y = d3.scaleLinear()
    .domain([0, 1000])
    .range([0, 500])

console.log(y(1100))

const rects = svg.selectAll('rect').data(data)

rects
    .attr('width', 50)
    .attr('height', d => y(d.value))
    .attr('fill', 'orange')
    .attr('x', (_, i) => i*70)

// Append enter selections
rects
    .enter()
    .append('rect')
    .attr('width', 50)
    .attr('height', d => y(d.value))
    .attr('fill', 'orange')
    .attr('x', (_, i) => i*70)