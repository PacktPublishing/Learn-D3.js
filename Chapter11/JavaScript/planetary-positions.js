// Source for algorithms and explanation: http://astro.if.ufrgs.br/trigesf/position.html
// of the code below.
// A mathematical explanation of each concept: http://www.davidcolarusso.com/astro/index.html
// See also other melhods: http://www.stargazing.net/kepler/index.html

/**
 * 
 * 
 * The primary orbital elements are here denoted as:
 *     N = longitude of the ascending node
 *     i = inclination to the ecliptic (plane of the Earth's orbit)
 *     w = argument of perihelion
 *     a = semi-major axis, or mean distance from Sun
 *     e = eccentricity (0=circle, 0-1=ellipse, 1=parabola)
 *     M = mean anomaly (0 at perihelion; increases uniformly with time)
 *
 * 
 */

const astro = {};

/**
 * Returns the position of Sun, moon or visible planet, given the day (since 2000/1/1 0.0)
 * @param dayNumber
 * @param object
 */
astro.position = function(dayNumber, object) {

    if(object.id == "Sun") {
        return astro.positionSun(dayNumber, object);
    }

    astro.compute(dayNumber, object);
    const data = object.computed;
    const mAnomaly = astro.radians(data.M);
    const ecliptic = astro.radians(data.ecl);

    let ea = mAnomaly + data.e * Math.sin(mAnomaly) * ( 1.0 + data.e * Math.cos(mAnomaly) );

    const eAnomaly = (data.e > 0.05) ? astro.calculateEAnomaly(mAnomaly, data.e, ea, 0) : ea;

    const xv = data.a * Math.cos(eAnomaly) - data.e;
    const yv = data.a * Math.sqrt(1.0 - data.e*data.e) * Math.sin(eAnomaly);

    const v = Math.atan2( yv, xv ); // true anomaly
    const r = Math.sqrt( xv*xv + yv*yv ); // distance

    // ecliptic coordinates
    const eclipticCoords = astro.eclipticCoords(r, v, astro.radians(data.w))
    // equatorial coordinates
    const equatorialCoords = astro.equatorialCoords(eclipticCoords, ecliptic);

    return {
        id: object.id,
        ra: astro.degrees(equatorialCoords[0]),
        dec: astro.degrees(equatorialCoords[1])
    };
}

/**
 * Gets the day number for a date
 * @param year
 * @param month
 * @param day
 * @param hours
 * @returns {number}
 */
astro.dayNumber = function(year, month, day, hours) {
    const d = Math.floor(367*year - 7 * ( year + (month+9)/12 ) /4  + 275*month/9 + day - 730530);
    return d + hours/24;
}

// These functions are used internally.
astro.compute = function(dayNumber, object) {
    const computed = {};
    for(element in object.constant) {
        computed[element] = object.constant[element] + object.variable[element] * dayNumber;
        computed.ecl = 23.4393 - 3.563E-7 * dayNumber;
    }
    object.computed = computed;
}

astro.positionSun = function(dayNumber, object) {
    astro.compute(dayNumber, object);
    const data = object.computed;
    const mAnomaly = astro.radians(data.M);
    const ecliptic = astro.radians(data.ecl);

    const eAnomaly = mAnomaly + data.e * Math.sin(mAnomaly) * ( 1.0 + data.e * Math.cos(mAnomaly) );

    const xv = Math.cos(eAnomaly) - data.e;
    const yv = Math.sqrt(1.0 - data.e*data.e) * Math.sin(eAnomaly);

    const v = Math.atan2( yv, xv ); // true anomaly
    const r = Math.sqrt( xv*xv + yv*yv ); // distance

    // ecliptic coordinates
    const eclipticCoords = astro.eclipticCoords(r, v, astro.radians(data.w))
    // equatorial coordinates
    const equatorialCoords = astro.equatorialCoords(eclipticCoords, ecliptic);

    return {
        id: object.id,
        ra: astro.degrees(equatorialCoords[0]),
        dec: astro.degrees(equatorialCoords[1])
    };
}

astro.equatorialCoords = function(eclipticCoords, ecliptic) {
    const x = eclipticCoords[0];
    const y = eclipticCoords[1] * Math.cos(ecliptic);
    const z = eclipticCoords[1] * Math.sin(ecliptic);

    const ra  = Math.atan2(y, x);
    const dec = Math.atan2(z, Math.sqrt(x*x + y*y));

    return [ra, dec];
}

astro.eclipticCoords = function(r, v, w) {
    const longitude = v + w;
    return [r * Math.cos(longitude), r * Math.sin(longitude)];
}

astro.calculateEAnomaly = function (ma, ecc, ea0, tries) {
    const ea1 = ea0 - (ea0 - ecc * Math.sin(ea0) - ma) / ( 1 - ecc * Math.cos(ea0));
    if( Math.abs(ea1 - ea0) > 1e-5 && tries < 100) {
        return astro.calculateEAnomaly(ma, ecc, ea1, ++tries);
    } else {
        return ea1;
    }
}

astro.radians = function(degrees) {
    return degrees * (Math.PI / 180);
}

astro.degrees = function(radians) {
    return radians * (180 / Math.PI);
}