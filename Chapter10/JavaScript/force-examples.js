/**
 * Created by helderdarocha on 17/01/19.
 */

function updateChart() {
    chart.selectAll('line.simulation')
        .attr("x1", d => d.source.x)
        .attr("x2", d => d.target.x)
        .attr("y1", d => d.source.y)
        .attr("y2", d => d.target.y);

    chart.selectAll('g.simulation')
        .attr("transform", d => `translate(${[d.x, d.y]})`);
}

function grid(nodes) {
    // Initial position in grid
    const step = (width - margin) * cols / (nodes.length);
    nodes.forEach(function(node, i) {
        node.x = (-i % cols + (nodes.length/cols-1)/2) * step;
        node.y = (-Math.floor(i/cols) + (nodes.length/cols-1)/2) * step;
    });
}

function center(nodes) {
    // Initial position - all nodes overlapped in center
    nodes.forEach(function(node, i) {
        node.x = 0
        node.y = 0;
    });
}

function drawReferenceBackgroundGrid(nodes, links) {
    drawReferenceBackground(grid, nodes, links)
}

function drawReferenceBackgroundCenter(nodes) {
    drawReferenceBackground(center, nodes)
}

function drawReferenceBackground(reference, nodes, links) {

    // draw margins
    svg.append('line').attr("x1", margin/2).attr("y1", margin/2).attr("x2", margin/2).attr("y2", height-margin/2)
        .attr("class", 'margin')
    svg.append('line').attr("x1", width-margin/2).attr("y1", margin/2).attr("x2", width-margin/2).attr("y2", height-margin/2)
        .attr("class", 'margin')
    svg.append('line').attr("x1", margin/2).attr("y1", margin/2).attr("x2", width - margin/2).attr("y2", margin/2)
        .attr("class", 'margin')
    svg.append('line').attr("x1", margin/2).attr("y1", height-margin/2).attr("x2", width-margin/2).attr("y2", height-margin/2)
        .attr("class", 'margin')

    reference(nodes);

    // draw grid
    chart.selectAll("line.v")
        .data(nodes.filter((n,i) => Math.floor(i / 3) == 0))
        .enter()
        .append("line").attr("class", 'v')
        .attr("x1", d => d.x).attr("y1", -height/2).attr("x2", d => d.x).attr("y2", height/2)
        .style("stroke", 'rgb(255,0,0,.3)');
    chart.selectAll("line.h")
        .data(nodes.filter((n,i) => i % 3 == 0))
        .enter()
        .append("line").attr("class", 'h')
        .attr("x1", -width/2).attr("y1", d => d.y).attr("x2", width/2).attr("y2", d => d.y)
        .style("stroke", 'rgb(255,0,0,.3)')

    // draw link references if links object exists
    if(links) {
        chart.selectAll('line.reflink')
            .data(links).enter()
            .append('line').attr("class",'reflink')
            .attr("x1", d => d.source.x)
            .attr("x2", d => d.target.x)
            .attr("y1", d => d.source.y)
            .attr("y2", d => d.target.y)
            .style("fill", 'none')
            .style("stroke", 'black')
            .style("stroke-width", 2)
    }

    // draw reference
    chart.selectAll('g.reference')
        .data(nodes).enter()
        .append("g").attr("class", "reference")
        .each(function(d,i) {
            d3.select(this)
                .append("circle")
                .attr("r", 15)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .style("fill", '#ddd')
                .style("stroke", '#999')
                .attr('stroke-dasharray', '2 2');
            d3.select(this)
                .append("text")
                .style("fill", 'gray')
                .text(d => d.node)
                .attr("x", d => d.x)
                .attr("y", d => d.y);

        });
}

function drawGuidelinesX(value) {
    chart.append("line").attr("class", "center")
        .attr("x1", -value).attr("y1", -height / 2).attr("x2", -value).attr("y2", height / 2)
        .style("stroke", 'green')
        .style("stroke-dasharray", "5 5");
    chart.append("line").attr("class", "center")
        .attr("x1", value).attr("y1", -height / 2).attr("x2", value).attr("y2", height / 2)
        .style("stroke", 'green')
        .style("stroke-dasharray", "5 5");
}

function drawGuidelinesY(value) {
    chart.append("line").attr("class", "center")
        .attr("x1", -width / 2).attr("y1", -value).attr("x2", width / 2).attr("y2", -value)
        .style("stroke", 'green')
        .style("stroke-dasharray", "5 5");
    chart.append("line").attr("class", "center")
        .attr("x1", -width / 2).attr("y1", value).attr("x2", width / 2).attr("y2", value)
        .style("stroke", 'green')
        .style("stroke-dasharray", "5 5");
}

function drawGuidecircle(radius) {
    chart.append("circle").attr("class", "center")
        .attr("r", radius)
        .style("fill","none")
        .style("stroke", 'green')
        .style("stroke-dasharray", "5 5");
}

function contrast(color) {
    const c = d3.rgb(color);
    return (c.r * 0.299 + c.g * 0.587 + c.b * 0.114) > 130 ? 'black' : 'white';
}