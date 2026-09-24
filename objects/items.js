import { Entity } from "./entity.js"
import { PreloadImages } from "./assets.js";
import { DamageTypes } from "./enums.js";


class Item extends Entity {
    constructor(globals, coordinate_x, coordinate_y, preloaded_image, sprite_size_x, sprite_size_y) {
        super(globals, coordinate_x, coordinate_y, preloaded_image, sprite_size_x, sprite_size_y);
        this.reaction_time = 0;
        this.reaction_time_max = 0;
        this.reaction_distance = 0;
        this.reach = 0;

        this.damage = 0;
        this.damage_type = DamageTypes.BLUDGEONING;
        this.knockback = 0;

        this.recover_time = 0;
        this.recover_time_max = 0;

        this.i_frames = 0;
        this.armor = DamageTypes.new_damage_details();
    }

    draw(ctx, owner) {
        this.coordinate_x = owner.coordinate_x;
        this.coordinate_y = owner.coordinate_y;
        super.draw(ctx);
    }

    think(owner) { }
}

export class SwordNBoard extends Item {
    constructor(globals, coordinate_x, coordinate_y) {
        super(globals, coordinate_x, coordinate_y, PreloadImages.DUDELING_SWORD_N_BOARD, 14, 14);

        this.armor[DamageTypes.BLUDGEONING] = 0.5;
        this.damage = 2;
        this.knockback = 5;
    }
}