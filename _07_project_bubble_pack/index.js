const data = [
    {name: 'india', parent: ''},

    {name: 'rajasthan', parent: 'india'},
    {name: 'uttar pradesh', parent: 'india'},
    {name: 'punjab', parent: 'india'},

    {name: 'jaipur', parent: 'rajasthan', people: 10},
    {name: 'jodhpur', parent: 'rajasthan', people: 7},
    {name: 'ajmer', parent: 'rajasthan', people: 6},
    {name: 'udaipur', parent: 'rajasthan', people: 8},
    {name: 'kota', parent: 'rajasthan', people: 4},
    {name: 'bikaner', parent: 'rajasthan', people: 3},

    {name: 'varanasi', parent: 'uttar pradesh', people: 11},
    {name: 'kanpur', parent: 'uttar pradesh', people: 15},
    {name: 'lucknow', parent: 'uttar pradesh', people: 9},
    {name: 'prayagraj', parent: 'uttar pradesh', people: 6},

    {name: 'Amritsar', parent: 'punjab', people: 7},
    {name: 'Bathinda', parent: 'punjab', people: 7},
    {name: 'Ferozepur', parent: 'punjab', people: 3},
]

// Create svg
const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', 800)
    .attr('height', 800)

// Create graph
const graph = svg.append('g')
                .attr('transform', 'translate(25, 25)')

// Stratify
const stratify =  d3.stratify()
                    .id(d => d.name)
                    .parentId(d => d.parent)


const rootNode = stratify(data)
                    .sum(d => d.people)

const pack = d3.pack()
                .size([750, 750])
                .padding(5)

const bubbleData = pack(rootNode).descendants()

const colors = d3.scaleOrdinal().range(['hsl(200, 100%, 50%)', 'hsl(200, 100%, 40%)', 'hsl(200, 100%, 30%)'])

const nodes = graph.selectAll('g')
    .data(bubbleData)
    .enter()
    .append('g')
    .attr('transform', d => `translate(${d.x}, ${d.y})`)

nodes.append('circle')
    .attr('r', d => d.r)
    .attr('stroke', '#fff')
    .attr('stroke-width', 1)
    .attr('fill', d => colors(d.depth))

nodes.filter(d => !d.children)
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.3em')
    .attr('fill', '#fff')
    .attr('font-size', d => d.value * 2)
    .text(d => d.data.name)
