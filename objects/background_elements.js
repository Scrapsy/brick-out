import { PreloadImages } from "./assets.js";
import { Entity } from "./entity.js";

export class BottomLine extends Entity {
    constructor(globals, coordinate_x, coordinate_y) {
        super(globals, coordinate_x, coordinate_y, PreloadImages.BOTTOM_LINE, 640, 8);
    }
}