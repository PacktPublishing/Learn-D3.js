function rotationToQuaternion([lambda, phi, gamma]) {
    const cLam = Math.cos(lambda / 2),
          sLam = Math.sin(lambda  / 2),
          cPhi = Math.cos(phi  / 2),
          sPhi = Math.sin(phi  / 2),
          cGam = Math.cos(gamma  / 2),
          sGam = Math.sin(gamma  / 2);

    const w = cLam * cGam * cPhi + sLam * sGam * sPhi;
    const x = cLam * cGam * sPhi - sLam * sGam * cPhi;
    const y = sLam * cGam * sPhi + cLam * sGam * cPhi;
    const z = sLam * cGam * cPhi - cLam * sGam * sPhi;

    return [w,x,y,z];
}

function quaternionToRotation([w,x,y,z]) {
    const yLam = 2 * (w * z + x * y);
    const xLam = 1 - 2 * (y * y + z * z);
    const yPhi = 2 * (w * x + y * z);
    const xPhi = 1 - 2 * (x * x + y * y);
    const nGam = 2 * (w * y - z * x);

    const lambda = Math.atan2(yLam, xLam);
    const phi    = Math.atan2(yPhi, xPhi);
    const gamma  = Math.abs(nGam) >= 1 ? Math.PI / 2 * nGam/Math.abs(nGam) : Math.asin(nGam);

    return [lambda, phi, gamma];
}

function multiply(a, b) {
    return [
        a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3],
        a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2],
        a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1],
        a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0]
    ];
}

function conjugate([w,x,y,z]) {
    return [w,-x,-y,-z];
}

function degrees(array) {
    return array.map(n => n * 180/Math.PI);
}

function radians(array) {
    return array.map(n => n * Math.PI/180);
}