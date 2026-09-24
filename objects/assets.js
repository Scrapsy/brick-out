import { Enum } from "../utilities/enum.js";

class ImgTypes extends Enum {
    static values = [
        "./objects/assets/entities/",
        "./objects/assets/effects/",
        "./objects/assets/obstructions/",
        "./objects/assets/backgrounds/"
    ];

    static ENTITIES = 0;
    static EFFECTS = 1;
    static OBSTRUCTIONS = 2;
    static BACKGROUNDS = 3;
}

class ImgSource {
    constructor(type, name) {
        this.type = type;
        this.name = name;
        this.source = ImgTypes.toText(this.type) + this.name + ".png";
    }
}

export class PreloadImages {
    static BOTTOM_LINE = new ImgSource(ImgTypes.BACKGROUNDS, "bottom_line");

    static BALL = new ImgSource(ImgTypes.ENTITIES, "ball");
    static PADDLE = new ImgSource(ImgTypes.ENTITIES, "paddle");

    static BRICK_ONE = new ImgSource(ImgTypes.ENTITIES, "brick_1");
    static BRICK_TWO = new ImgSource(ImgTypes.ENTITIES, "brick_2");
    static BRICK_THREE = new ImgSource(ImgTypes.ENTITIES, "brick_3");
    static BRICK_FOUR = new ImgSource(ImgTypes.ENTITIES, "brick_4");
    static BRICK_FIVE = new ImgSource(ImgTypes.ENTITIES, "brick_5");
    static BRICK_SIX = new ImgSource(ImgTypes.ENTITIES, "brick_6");
    static BRICK_SIX_SHARD = new ImgSource(ImgTypes.ENTITIES, "brick_6_shard");
    static BRICK_SEVEN = new ImgSource(ImgTypes.ENTITIES, "brick_7");
    static BRICK_EIGHT = new ImgSource(ImgTypes.ENTITIES, "brick_8");
    static BRICK_NINE = new ImgSource(ImgTypes.ENTITIES, "brick_9");

    static FLAME = new ImgSource(ImgTypes.EFFECTS, "flame");
    static BALL_SHARD = new ImgSource(ImgTypes.EFFECTS, "ball_shard");
}