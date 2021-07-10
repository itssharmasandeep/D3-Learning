const data = []

// graph dimensions
const margins = {
    top: 40,
    right: 20,
    bottom: 50,
    left: 100
}

const dims = {
    width: 560,
    height: 400
}

const graphDims = {
    width: dims.width - margins.left - margins.right,
    height: dims.height - margins.top - margins.bottom
}

// graph element
const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', dims.width)
    .attr('height', dims.height)

const graph = svg.append('g')
    .attr('width', graphDims.width)
    .attr('height', graphDims.height)
    .attr('transform', `translate(${margins.left}, ${margins.top})`)

// Scales
const x = d3.scaleTime().range([0, graphDims.width]);

const y = d3.scaleLinear().range([graphDims.height, 0]);

// Axes group
const xAxis = graph.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${graphDims.height})`)

const yAxis = graph.append('g')
    .attr('class', 'y-axis')

// D3 line path generator
const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.vaccines))

const linePath = graph.append('path')

// dotted lines
const dottedLines = graph.append('g')
                        .attr('opacity', 0)

const xDottedLine = dottedLines.append('line')
                        .attr('stroke', '#ccc')
                        .attr('stroke-width', 1)
                        .attr('stroke-dasharray', '2 2')

const yDottedLine = dottedLines.append('line')
                        .attr('stroke', '#ccc')
                        .attr('stroke-width', 1)
                        .attr('stroke-dasharray', '2 2')

// Update graph
const updateGraph = (updatedData) => {
    // Set scale domains
    x.domain(d3.extent(updatedData, d => d.date));
    y.domain([0, d3.max(updatedData, d => d.vaccines)]);

    // line path
    linePath.data([updatedData])
        .attr('fill', 'none')
        .attr('stroke', '#00bfa5')
        .attr('stroke-width', 2)
        .attr('d', line)

    // Create axes
    const x_axis = d3.axisBottom(x)
        .ticks(4)
        .tickFormat(d3.timeFormat('%b %d'))
    const y_axis = d3.axisLeft(y)
        .ticks(4)

    // Call Axes
    xAxis.call(x_axis)
    yAxis.call(y_axis)

    // Create circles for data points
    const circles = graph.selectAll('circle')
        .data(updatedData)

     // Remove if needed
     circles.exit().remove()

    // Update points
    circles
        .attr('cx', d => x(d.date))
        .attr('cy', d => y(d.vaccines))
        
    // Add new points
    circles.enter()
        .append('circle')
        .attr('r', 4)
        .attr('cx', d => x(d.date))
        .attr('cy', d => y(d.vaccines))
        .attr('fill', '#ccc')

    graph.selectAll('circle')
        .on('mouseover', (e, d) => {
            d3.select(e.currentTarget)
                .transition().duration(250)
                .attr('r', 6)
                .attr('fill', '#fff')

            dottedLines
                .transition().duration(250)
                .attr('opacity', 1)
            
            xDottedLine
                .attr('x1', x(d.date))
                .attr('y1', y(d.vaccines))
                .attr('x2', 0)
                .attr('y2', y(d.vaccines))

            yDottedLine
                .attr('x1', x(d.date))
                .attr('y1', y(d.vaccines))
                .attr('x2',  x(d.date))
                .attr('y2', graphDims.height)
            
        })
        .on('mouseout', (e, d) => {
            d3.select(e.currentTarget)
                .transition().duration(250)
                .attr('r', 4)
                .attr('fill', '#ccc')

            dottedLines
                .transition().duration(250)
                .attr('opacity', 0)
            
        })
    

    console.log(updatedData)
}

// Adding data
const addDataBtn = document.getElementById('add-data')

addDataBtn.addEventListener('click', () => {
    data.push({
        date: new Date(),
        vaccines: Math.ceil(Math.random() * 40) * 25
    })
    updateGraph(data)
})