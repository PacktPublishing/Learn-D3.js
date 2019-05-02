/* Tissot' indicatrix */

const tissot = {}

tissot.makeIndicatrix = function(radius, stepLon, stepLat, maxLon, maxLat) {

    if(!stepLon) stepLon = 10;
    if(!stepLat) stepLat = 10;
    if(!maxLon) maxLon = 180;
    if(!maxLat) maxLat = 80;
    if(!radius) radius = 2;

    const circles = [];
    for(let lon = -maxLon; lon < maxLon; lon += stepLon) {
        for(let lat = -maxLat; lat <= maxLat; lat += stepLat) {
            const circle = d3.geoCircle()
                .center([lon, lat])
                .radius(radius)
                .precision(1);
            circles.push( circle() );
        }
    }
    return circles;
}
