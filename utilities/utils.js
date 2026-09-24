export class U {
    static angle(ox, oy, tx, ty) {
        var dy = ty - oy;
        var dx = tx - ox;
        var theta = Math.atan2(dy, dx); // range (-PI, PI]
        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        return theta;
    }

    static distanceBetween(ox, oy, tx, ty) {
        return Math.sqrt((Math.pow(tx-ox,2))+(Math.pow(ty-oy,2)))
    };

    static unangle(theta) {
        let rad = theta * Math.PI / 180;
        return {x: Math.cos(rad), y: Math.sin(rad)};
    }
}