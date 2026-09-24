import { PreloadImages } from "./assets.js";
import { Entity } from "./entity.js";

export class Obstruction extends Entity {
    constructor(globals, coordinate_x, coordinate_y) {
        super(globals, coordinate_x, coordinate_y, PreloadImages.ROCK, 14, 14);
        this.weight = 100;
    }
}