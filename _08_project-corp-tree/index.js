const data = [
    {name: 'india', parent: ''},

    {name: 'rajasthan', parent: 'india'},
    {name: 'uttar pradesh', parent: 'india'},
    {name: 'punjab', parent: 'india'},

    {name: 'jaipur', parent: 'rajasthan'},
    {name: 'jodhpur', parent: 'rajasthan'},
    {name: 'ajmer', parent: 'rajasthan'},
    {name: 'udaipur', parent: 'rajasthan'},
    {name: 'kota', parent: 'rajasthan'},
    {name: 'bikaner', parent: 'rajasthan'},

    {name: 'varanasi', parent: 'uttar pradesh'},
    {name: 'kanpur', parent: 'uttar pradesh'},
    {name: 'lucknow', parent: 'uttar pradesh'},
    {name: 'prayagraj', parent: 'uttar pradesh'},

    {name: 'Amritsar', parent: 'punjab'},
    {name: 'Bathinda', parent: 'punjab'},
    {name: 'Ferozepur', parent: 'punjab'},
]

// Create svg
const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', 1100)
    .attr('height', 600)

// Create graph
const graph = svg.append('g')
    .attr('transform', 'translate(50, 50)')

// data strat
const stratify = d3.stratify()
    .id(d => d.name)
    .parentId(d => d.parent)

const tree = d3.tree()
    .size([1000, 500])

// update function
const update = (newData) => {
    const rootNode = stratify(newData)
    const treeData = tree(rootNode)

    const nodes = graph.selectAll('.nodes')
        .data(treeData.descendants())

    const links = graph.selectAll('.links')
        .data(treeData.links())

    console.log(treeData.links())
    
    links.enter().append('path')
        .attr('class', 'link')
        .attr('fill', 'none')
        .attr('stroke', '#aaa')
        .attr('stroke-width', 2)
        .attr('d', d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y)
        )

    // Create enter node group
    const enterNodes = nodes.enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x}, ${d.y})`)

    enterNodes.append('rect')
        .attr('fill', '#aaa')
        .attr('stroke', '#555')
        .attr('stroke-width', 1)
        .attr('height', 50)
        .attr('width', d => d.data.name.length * 20)
        .attr('transform', d => `translate(-${d.data.name.length * 10}, -25)`)

    enterNodes.append('text')
        .attr('text-anchor', 'middle')
        .attr('fill', '#ccc')
        .text(d => d.data.name)
}

update(data)
