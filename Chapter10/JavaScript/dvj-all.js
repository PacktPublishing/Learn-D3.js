const dvj = {}

/**
 *
 * @param names - List of objects with node identification information (ex: list of strings)
 * @param matrix - Square matrix with adjacency data
 * @returns {{nodes: Array of {node: name}, links: Array of {source: i, target: j, value: matrix[i,j]}}
 */
dvj.matrixToLinks = function(nodes, matrix, objectID) {

    const links = [];

    for(let s = 0; s < matrix.length; s++) {
        for(let t = 0; t < matrix.length; t++) {
            const v = matrix[s][t];
            if(v != 0) {
                if(!objectID) {
                    links.push({source: s, target: t, value: v});
                } else {
                    links.push({source: nodes[s], target: nodes[t], value: v});
                }
            }
        }
    }

    return links;
}

/**
 *
 * @param nodes
 * @param links
 * @returns {[
 *             [0, links.filter(k => k.source == 0 && k.target == 1)[0].value, ...],
 *             [...],
 *             ...
 *          ]}
 */
dvj.linksToMatrix = function(nodes, links, objectID) {

    const matrix = [];

    for(let s = 0; s < nodes.length; s++) {
        const line = [];
        for(let t = 0; t < nodes.length; t++) {
            const link = !objectID ? links.filter(k => k.source == s && k.target == t) :
                                     links.filter(k => k.source == nodes[s] && k.target == nodes[t]);
            if(link.length != 0) {
                line.push(link[0].value);
            } else {
                line.push(0);
            }
        }
        matrix.push(line);
    }

    return matrix;
}

/**
 * Adjacency Matrix layout generator function
 * Default size is 1x1
 *
 * To create a layout function in a 800x600 view space:
 *
 * const matrixLayout = dvj.adjacencyMatrix()
 *                         .size([800,600]);
 *
 * To generate an array of matrix-positioned objects:
 *
 * const data = matrixLayout(names, matrix);
 *
 * Where names is a list of objects and matrix a square matrix of values
 *
 * Result is array with (nodes x nodes) elements. Each element contains:
 *   x - x position of rectangle
 *   y - x position of rectangle
 *   w - width of rectangle
 *   h - height of rectangle
 *
 * If element is an adjacency (value > 0), it additionally contains:
 *   value - original valua
 *   source - source node
 *   target - target node
 *
 * @returns layout function
 */

dvj.adjacencyMatrix = function() {
    let w = 1, h = 1;

    function layout(nodes, sourceMatrix) {

        const len = nodes.length;

        const resultMatrix = [];
        for(let s = 0; s < sourceMatrix.length; s++) {
            for(let t = 0; t < sourceMatrix.length; t++) {
                const v = +sourceMatrix[s][t];
                const rect = {x: t * w/len, y: s * h/len, w: w/len, h: h/len};
                if(v > 0) {
                    const edge = {source: nodes[s], target: nodes[t], value: value = v};
                    resultMatrix.push(Object.assign(edge, rect));
                } else {
                    resultMatrix.push(Object.assign({}, rect));
                }
            }
        }
        return resultMatrix;
    }

    layout.size = function(array) {
        return arguments.length ? (w = +array[0], h = +array[1], layout) : [w, h];
    }

    return layout;
}

/**
 * Arc diagram layout generator function
 * Default size is 1x1
 *
 * To create a layout function in a 800x600 view space:
 *
 * const arcDiagLayout = dvj.arcDiagram()
 *                          .width(800);
 *
 * To generate an array of arc-positioned objects:
 *
 * const layout = arcDiagLayout(node, edges);
 *
 * Where nodes and edges have the following minimum structure:
 *
 * nodes: [{node: obj1}, {node: obj2}, ...]
 * edges: [{source: obj1, target: obj2}, ...]
 *
 * Results:
 *
 * layout.nodes(): adds x coordinate for each node
 * layout.links(): replaces references for links to source and target for each edge
 *
 * @returns layout function
 */

dvj.arcDiagram = function() {
    let w = 1;

    const points = [];
    const curves = [];

    function layout(n, e) {

        const nodes = n.map(a => Object.assign({}, a));
        const edges = e.map(a => Object.assign({}, a));

        const len = nodes.length;

        nodes.forEach(function(node, i) {
            node.x = i * w/len;
            node.i = i;
            points.push(node);
        });

        const groups = d3.nest()
            .key(d => d.node)
            .rollup(d => d[0])
            .map(nodes);

        edges.forEach(function(edge, j) {
            if(isNaN(edge.source)) {
                edge.source = groups.get(edge.source);
                edge.target = groups.get(edge.target);
                if(edge.source && edge.target && edge.value > 0) {
                    curves.push(edge);
                }
            } else {
                edge.source = nodes[edge.source];
                edge.target = nodes[edge.target];
                if(edge.source && edge.target && edge.value > 0) {
                    curves.push(edge);
                }
            }
        });

        points.forEach(function(node, i) {
            node.sources = edges.filter(edge => edge.source == node);
            node.targets = edges.filter(edge => edge.target == node);
        });

        return {nodes: () => points, links: () => curves};
    }

    layout.width = function(width) {
        return arguments.length ? (w = +width, layout) : w;
    }

    return layout;
}

/**
 *
 */
dvj.curve = function() {

    let h = 2;
    let w = 1;

    let source = d => d.source.x;
    let target = d => d.target.x;
    let midY   = d => d.source.x - d.target.x;

    function layout(d) {
        const line = d3.line().curve(d3.curveBundle.beta(0.75));
        const height = d3.scaleLinear().range([0,h/2]).domain([0,w])
        return line([ [source(d),0],[(source(d)+target(d))/2,height(midY(d))],[target(d),0] ]);
    }

    layout.source = (func) => arguments.length ? (source = func, layout) : source;
    layout.target = (func) => arguments.length ? (target = func, layout) : target;
    layout.midY   = (func) => arguments.length ? (midY = func, layout) : midY;

    layout.size = function(array) {
        return arguments.length ? (w = +array[0], h = +array[1] * 2, layout) : [w, h];
    }

    return layout;
}

dvj.circleDiagram = function() {
    let w = 1;
    let h = 1;

    const points = [];
    const curves = [];

    function layout(n, e) {

        const nodes = n.map(a => Object.assign({}, a));
        const edges = e.map(a => Object.assign({}, a));

        const circ = 2 * Math.PI;

        nodes.forEach(function(node, i) {
            node.angle = i * circ/nodes.length;
            node.radius = Math.min(w,h)/2;
            node.i = i;
            points.push(node);
        });

        const groups = d3.nest()
            .key(d => d.node)
            .rollup(d => d[0])
            .map(nodes);

        edges.forEach(function(edge, j) {
            if(isNaN(edge.source)) {
                edge.source = groups.get(edge.source);
                edge.target = groups.get(edge.target);
                if(edge.source && edge.target && edge.value > 0) {
                    curves.push(edge);
                }
            } else {
                edge.source = nodes[edge.source];
                edge.target = nodes[edge.target];
                if(edge.source && edge.target && edge.value > 0) {
                    curves.push(edge);
                }
            }
        });

        points.forEach(function(node, i) {
            node.sources = edges.filter(edge => edge.source == node);
            node.targets = edges.filter(edge => edge.target == node);
        });

        return {nodes: () => points, links: () => curves};
    }

    layout.size = function(array) {
        return arguments.length ? (w = +array[0], h = +array[1], layout) : [w, h];
    }

    return layout;
};

dvj.squareGrid = function() {
    let w = 1;
    let h = 1;
    let rows = 1;
    let cols = 1;
    let offset = 0;
    let step = 1;

    const nodes = [];

    function layout(n, e) {

        const points = n.map(a => Object.assign({}, a));
        const edges  = e.map(a => Object.assign({}, a));

        const places = rows * cols;

        const grid = [];
        for(let i = 0; i < cols; i++) {
            for(let j = 0; j < rows; j++) {
                const point = {};
                point.x = i * w/(cols-1);
                point.y = j * h/(rows-1);
                grid.push(point);
            }
        }

        points.forEach(function(point, i) {
            point.x = grid[(offset + step * i) % grid.length].x;
            point.y = grid[(offset + step * i) % grid.length].y;
            point.index = i%grid.length;
            nodes.push(point);
        });

        const groups = d3.nest()
            .key(d => d.node)
            .rollup(d => d[0])
            .map(points);

        edges.forEach(function(edge, j) {
            edge.source = groups.get(edge.source);
            edge.target = groups.get(edge.target);
        });

        nodes.forEach(function(node, i) {
            node.sources = edges.filter(edge => edge.source == node);
            node.targets = edges.filter(edge => edge.target == node);
        });

        edges.sort((a,b) => d3.ascending(a.source.node, b.source.node) || d3.ascending(a.target.node, b.target.node));

        console.log('sorted', edges)

        // https://stackoverflow.com/questions/11368339/drawing-multiple-edges-between-two-nodes-with-d3
        for (let i = 0; i < edges.length; i++) {
            if (i != 0 && edges[i].source == edges[i-1].source && edges[i].target == edges[i-1].target) {
                edges[i].edgeNumber = edges[i-1].edgeNumber + 1;
            } else {
                edges[i].edgeNumber = 1;
            };
        };

        return {nodes: () => nodes, edges: () => edges};
    }

    layout.offset = function(value) {
        return arguments.length ? (offset = +value, layout) : offset;
    }
    layout.step = function(value) {
        return arguments.length ? (step = +value, layout) : step;
    }
    layout.gridSize = function(array) {
        return arguments.length ? (cols = +array[0], rows = +array[1], layout) : [cols, rows];
    }
    layout.size = function(array) {
        return arguments.length ? (w = +array[0], h = +array[1], layout) : [w, h];
    }

    return layout;
}

dvj.graphLink = function() {

    let w = 1;
    let h = 1;
    const ref = .00001;
    let allCurves = true;
    let direction = 1;
    let curvature = 1;
    let symmetric = true;

    const dx = d => d.target.x - d.source.x;
    const dy = d => d.target.y - d.source.y;
    const dr = (d,dir) => (dx(d)*dy(d)) * ref/curvature * (w+h) * (d.edgeNumber + dir)/4;
    let midY = d => d.source.x - d.target.x;
    let midX = d => d.source.y - d.target.y;

    function layout(d) {
        const direction = symmetric ? d.edgeNumber % 2 : 1;
        const curve = d.edgeNumber % 2 == 0 || allCurves ? `A ${dr(d,direction)},${dr(d,direction)} 0 0,${direction} ` : "L";
        return "M" + d.source.x + "," + d.source.y + curve + d.target.x + "," + d.target.y;
    }

    layout.size = function(array) {
        return arguments.length ? (w = +array[0], h = +array[1], layout) : [w, h];
    }
    layout.curvesOnly = function(bool) {
        return arguments.length ? (allCurves = bool, layout) : allCurves;
    }
    layout.symmetric = function(bool) {
        return arguments.length ? (symmetric = bool, layout) : symmetric;
    }
    layout.curvature = function(value) {
        return arguments.length ? (curvature = (value == 0) ? .0001 : value, layout) : curvature;
    }

    return layout;




}