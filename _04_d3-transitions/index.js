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
    .range([0, gWidth])
    .paddingInner(0.2)
    .paddingOuter(0.2)

// Creating linear scale
const y = d3.scaleLinear()
    .range([gHeight, 0])


// Create axes
const xAxis = d3.axisBottom(x)
const yAxis = d3.axisLeft(y).ticks(3).tickFormat(d => d+'%')


xAxisGroup.selectAll('text').attr('transform', 'rotate(-40)').attr('text-anchor', 'end')

const update = (updatedData) => {

    // Update scales if rely on data
    y.domain([0, d3.max(updatedData, d=> d.value)])
    x.domain(updatedData.map(d => d.name))

    // Re-join the data
    const rects = graph.selectAll('rect').data(updatedData)

    // Remove unwanted selections
    rects.exit().remove()

    // Update the current shapes in the dom
    rects
    .attr('width', x.bandwidth)
    .attr('fill', 'orange')
    .attr('x', d => x(d.name))
    // .transition(t)
    //     .attr('height', d => gHeight - y(d.value))
    //     .attr('y', d => y(d.value))

    // Append the enter selection to the dom
    rects
        .enter()
        .append('rect')
        .attr('width', x.bandwidth)
        .attr('height', 0)
        .attr('fill', 'orange')
        .attr('x', d => x(d.name))
        .attr('y', gHeight)
        .merge(rects)
        .transition().duration(500)
            .attr('height', d => gHeight - y(d.value))
            .attr('y', d => y(d.value))


    // Call Axes
    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)
}

update(data)

setInterval(() => {
    data[0].value +=50
    update(data)
}, 2000)
