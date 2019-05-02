// GeoJSON WGS84 Resampling fix for some projections
// https://github.com/d3/d3-geo-projection/issues/75
// https://beta.observablehq.com/@fil/wgs84-resampling

function resamplecoordinates(coordinates) {
    var i = 0,
        j = -1,
        n = coordinates.length,
        source = coordinates.slice(),
        p0, x0, y0,
        p1 = coordinates[0], x1 = p1[0], y1 = p1[1],
        dx, dy, d2,
        m2 = 10; // squared minimum angular distance
    while (++i < n) {
        p0 = p1, x0 = x1, y0 = y1;
        p1 = source[i], x1 = p1[0], y1 = p1[1];
        dx = x1 - x0, dy = y1 - y0, d2 = dx * dx + dy * dy;
        coordinates[++j] = p0;
        if (d2 > m2) for (var k = 1, m = Math.ceil(Math.sqrt(d2 / m2)); k < m; ++k) {
            coordinates[++j] = [x0 + dx * k / m, y0 + dy * k / m];
        }
    }
    coordinates[++j] = p1;
    coordinates.length = j + 1;
    return coordinates;
}

function resample(obj) {
    obj = JSON.parse(JSON.stringify(obj)); // deep clone urk
    switch (obj.type) {
        case "FeatureCollection":
            obj.features = obj.features.map(resample);
            break;
        case "Feature":
            obj.geometry = resample(obj.geometry);
            break;
        case "MultiPolygon":
            obj.coordinates = obj.coordinates.map(d => d.map(resamplecoordinates));
            break;
        case "Polygon":
            obj.coordinates = obj.coordinates.map(resamplecoordinates);
            break;
        case "MultiLineString":
            obj.coordinates = obj.coordinates.map(resamplecoordinates);
            break;
        case "LineString":
            obj.coordinates = resamplecoordinates(obj.coordinates);
            break;
    }
    return obj;
}