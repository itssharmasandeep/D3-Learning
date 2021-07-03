const canvas = d3.select('.canvas');

const svg = canvas.append('svg')
    .attr('width', 600)
    .attr('height', 600)

// Append shapes
svg.append('rect')
    .attr('width', 200)
    .attr('height', 100)
    .attr('x', 50)
    .attr('y', 50)
    .attr('fill', 'orange')

svg.append('circle')
    .attr('cx', 400)
    .attr('cy', 100)
    .attr('r', 50)
    .attr('fill', 'pink')

// Append text
svg.append('text')
    .attr('x', 20)
    .attr('y', 200)
    .attr('fill', 'red')
    .text('Hello!!')
    .style('font-family', 'arial')

