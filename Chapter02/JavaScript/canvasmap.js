function scaleX(coord) {
    return canvas.width * (180 + coord) / 360;
}

function scaleY(coord) {
    return canvas.height * (90 - coord) / 180;
}

function drawPolygon(coords) {
    ctx.beginPath();
    for(let i = 0; i < coords.length; i++ ) {
        let latitude = coords[i][1];
        let longitude = coords[i][0];
        if(i == 0) {
            ctx.moveTo(scaleX(longitude), scaleY(latitude));
        } else {
            ctx.lineTo(scaleX(longitude), scaleY(latitude));
        }
    }
    ctx.stroke();
    ctx.fill();
}

function drawMap(data) {
    data.forEach(obj => {
        if(obj.geometry.type == 'MultiPolygon') {
            obj.geometry.coordinates.forEach(poly => drawPolygon(poly[0]));
        } else if(obj.geometry.type == 'Polygon') {
            obj.geometry.coordinates.forEach(poly => drawPolygon(poly));
        }
    });
}