let initialData = [
    {
        name: 'India',
        cases: 1000
    },
    {
        name: 'United States',
        cases: 900
    },
    {
        name: 'United Kingdom',
        cases: 300
    },
    {
        name: 'China',
        cases: 550
    }
];

const dims = {
    height: 300,
    width: 300,
    radius: 150,
    innerRadius: 75
}

const cent = {
    x: (dims.width/2) + 5,
    y: (dims.height/2) + 5,
}

const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', dims.width + 10)
    .attr('height', dims.height + 10)

const graph = svg.append('g')
    .attr('transform', `translate(${cent.x}, ${cent.y})`)

const tooltip = svg.append('g')
    .attr('transform', `translate(${cent.x + 5}, ${cent.y - 12.5})`)
    .attr('opacity', 0)
    .attr('visibility', 'hidden')
    .attr('pointer-events', 'none')

tooltip.append('rect')
    .attr('width', 100)
    .attr('height', 30)
    .attr('rx', 5)
    .attr('ry', 5)


const pointerRect = tooltip.append('rect')
    .attr('width', 10)
    .attr('height', 10)
    .attr('rx', 2)
    .attr('ry', 2)
    .attr('transform', `translate(0, 7.5), rotate(45) `)

const tooltipColorRect = tooltip.append('rect')
    .attr('width', 10)
    .attr('height', 10)
    .attr('rx', 2)
    .attr('ry', 2)
    .attr('stroke', 'white')
    .attr('transform', `translate(7.5, 10) `)

const tooltipText = tooltip.append('text')
    .text('Tooltip')
    .attr('fill', 'white')
    .attr('font-size', 13)
    .attr('transform', `translate(25,20) `)

const pie = d3.pie()
    .sort(null)
    .value(d => d.cases)

const arcPath = d3.arc()
    .outerRadius(dims.radius)
    .innerRadius(dims.innerRadius)

const colors = d3.scaleOrdinal(d3['schemeSet3'])

const arcEnterTween = (d) => {
    const i = d3.interpolate(d.endAngle, d.startAngle)
    return function(t) {
        d.startAngle = i(t)
        return arcPath(d)
    }
}

const arcExitTween = (d) => {
    const i = d3.interpolate(d.startAngle, d.endAngle)
    return function(t) {
        d.startAngle = i(t)
        return arcPath(d)
    }
}

function arcUpdateTween(d) {
    var i = d3.interpolate(this._current, d)
    this._current = d
    
    return function(t) {
        return arcPath(i(t))
    }
}

const showTooltip = (x, y, text, color) => {
    tooltipColorRect.attr('fill', color)
    tooltipText.text(text)
    const offset = x + 100 > dims.radius ? 100 : 0;
    if(offset) {
        pointerRect.attr('transform', `translate(100, 7.5), rotate(45) `)
    } else {
        pointerRect.attr('transform', `translate(0, 7.5), rotate(45) `)
    }
    tooltip.attr('visibility', 'visible')
            .transition('showOrHideTooltip').duration(750)
                .attr('opacity', 1)
                .attr('transform', `translate(${x + dims.radius - offset}, ${y + dims.radius})`)
}

const hideTooltip = () => {
    tooltip.attr('visibility', 'hidden').attr('opacity', 0)
}

const update = (updatedData) => {

    // Update color scale domain
    colors.domain(updatedData.map(d => d.name))

    // join enhanced (pie) data to the path elements
    const paths = graph.selectAll('path')
        .data(pie(updatedData))

    // handle the exit selection
    paths.exit()
    .transition().duration(750)
        .attrTween('d', arcExitTween)
    .remove()

    // handle the current DOM path updates
    paths.attr('d', arcPath)
    .transition().duration(750)
        .attrTween('d', arcUpdateTween)
    
    // handle the enter selction
    paths.enter()
        .append('path')
        .classed('arc', true)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .attr('fill', d => colors(d.data.name))
        .attr('opacity', 0.95)
        .each(function(d){ this._current = d })
        .transition().duration(750)
            .attrTween('d', arcEnterTween)


    // add events listeners
    graph.selectAll('path')
        .on('mouseover', (e, d) => {
            d3.select(e.currentTarget)
                .transition('changeSliceFill').duration(300)
                    .attr('opacity', 1)
                    .attr('transform', 'scale(1.015, 1.015)')

            const midAngle = (d.startAngle + d.endAngle)/2;
            const midPoint = (dims.innerRadius + dims.radius)/2;
            const x = Math.sin(midAngle) * (midPoint)
            const y = Math.cos(midAngle) * (midPoint * -1)

            showTooltip(x, y, d.value, colors(d.data.name))
        })
        .on('mouseout', e => {
            d3.select(e.currentTarget)
                .transition('changeSliceFill').duration(300)
                .attr('opacity', 0.95)
                .attr('transform', 'scale(1, 1)')
            
            hideTooltip();
        })
        .on('click', (_, d) => {
            initialData =  initialData.filter(dt => dt.name !== d.data.name)
            update(initialData)
        })
}

update(initialData)

const form = document.querySelector('form');
const nameInput = document.querySelector('#name');
const casesInput = document.querySelector('#cases');
const error = document.querySelector('#error');

form.addEventListener('submit', (e) => {
    e.preventDefault()
    error.textContent = '';
    if(!nameInput.value) {
        error.textContent = 'Please enter name input value'
    }
    else if(nameInput.value.length > 15) {
        error.textContent = 'name must be less than 15'
    }
    else if(initialData.findIndex(d => d.name.toLowerCase() === nameInput.value.toLowerCase()) !== -1) {
        error.textContent = `Country name : ${nameInput.value} already exist`
    }
    else if(!casesInput.value) {
        error.textContent = 'Please enter cases input value'
    }
    else if(Number(casesInput.value) > 1000 || Number(casesInput.value) < 0 || isNaN(Number(casesInput.value))) {
        error.textContent = 'cases must be a number less than equal to 1000 and greater than 0'
    }

    if(!error.textContent) {
        initialData.push({name: nameInput.value, cases:  Number(casesInput.value)})
        form.reset()
        update(initialData)
    }
})